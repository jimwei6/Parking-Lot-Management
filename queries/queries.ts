import { profile, vehicle, spotFilter } from '../util/types';
import pool from '../util/dbConnect';
import createHttpError from 'http-errors';
import { Client } from 'pg';

async function executeQuery(query: string, values: any = [], client: Client | null = null) {
  if (client) {
    return client.query(query, values).then(res => res.rows);
  }
  return pool.query(query, values).then(res => res.rows);
}

async function transaction(fn: Function) {
  const client = await pool.connect();
  let result = null;
  let hasError = null;
  try{
    await client.query('BEGIN');
    result = await fn(client);
    await client.query('COMMIT');
  } catch(error) {
    hasError = error;
    result = null;
    await client.query('ROLLBACK');
  } finally {
    client.release();
    if (hasError) throw hasError;
    return result;
  }
}

function getParkingLots(): any {
  return executeQuery(`SELECT * FROM parkingLots`);
}

function getAccount(username: string, password: string): any {
  return executeQuery(`SELECT * FROM accounts WHERE username = $1 AND password = $2`, [username, password]);
}

function getUserProfile(username: string) {
  return executeQuery(`SELECT vo.name, vo.address, pd.phoneNumber, pd.pronouns, pd.gender, pd.dob, a.email, a.password
    FROM accounts as a, vehicleOwner as vo, personalDetails as pd 
    WHERE a.username = $1 AND vo.username = a.username AND pd.ownerID = vo.ownerID LIMIT 1`, [username]);
}

async function updateUserProfile(username: string, profile: profile) {
  return transaction(async (client: Client) => {
    const [updatedAccount, updatedVO] = await Promise.all([
      executeQuery(`UPDATE accounts SET password = $1, email = $2 WHERE username = $3 RETURNING *`, [profile.password, profile.email, username], client),
      executeQuery(`UPDATE vehicleOwner SET 
        address = $1, name = $2
        WHERE username = $3 RETURNING *`, 
        [profile.address, profile.name, username], client)
    ]);
  
    const updatedDetails = await executeQuery(`UPDATE personalDetails SET dob = $1, gender = $2, phoneNumber = $3, pronouns = $4
      WHERE ownerID = $5 RETURNING *`, 
      [new Date(profile.dob).toLocaleDateString('en-CA'), profile.gender,
        profile.phoneNumber, profile.pronouns, updatedVO[0].ownerid], client);
    return {
      email: updatedAccount[0].email,
      password: updatedAccount[0].password,
      name: updatedVO[0].name,
      phoneNumber: updatedDetails[0].phonenumber,
      address: updatedVO[0].address,
      pronouns: updatedDetails[0].pronouns,
      gender: updatedDetails[0].gender,
      dob: updatedDetails[0].dob
    };
  });
}

function getVehicles(username: string, licensePlate: string | null | undefined): any {
  let query = `SELECT
      v.licensePlate,
      v.modelName AS model,
      v.height,
      v.color,
      CASE 
          WHEN ev.plugType IS NOT NULL THEN ev.plugType
      END AS plugType,
      array_agg(p.permitType) AS permits,
      CASE
          WHEN ev.plugType IS NULL THEN FALSE
          ELSE TRUE
      END AS isElectric
    FROM vehicle v
    LEFT JOIN electricVehicle ev
      ON v.licensePlate = ev.licensePlate
    LEFT JOIN permits p
      ON v.licensePlate = p.licensePlate
    JOIN vehicleOwner vo
      ON v.ownerID = vo.ownerID
    WHERE vo.username = $1 `;

  if (licensePlate !== null && licensePlate !== undefined) {
    return executeQuery(query + 
      ` AND v.licensePlate = $2 GROUP BY v.licensePlate, ev.plugType LIMIT 1`, [username, licensePlate]);
  } else {
    return executeQuery(query + 
      ` GROUP BY v.licensePlate, ev.plugType`, [username]);
  }
}

function getPermits(): any {
  return executeQuery(`SELECT title FROM permitType`);
}

function getModels(): any {
  return executeQuery(`SELECT modelname FROM model`);
}

function getPlugTypes(): any {
  return executeQuery(`SELECT plugtype from chargers`);
}

function getSpotTypes(): any {
  return ["normal", "vip", "company", "reserved"];
}

function getAccessTypes(): any {
  return ["infant", "accessibility"];
}

async function updateVehicle(username: string, vehicleDetails: vehicle) {
  return transaction(async (client: Client) => {
    const verifyOwner = await executeQuery(`SELECT v.ownerid, v.licenseplate, ev.plugtype FROM accounts AS a
    INNER JOIN vehicleowner AS vo on vo.username = a.username
    INNER JOIN vehicle as v on v.ownerid = vo.ownerid
    LEFT JOIN electricvehicle AS ev on ev.licenseplate = v.licenseplate
    WHERE a.username = $1 AND v.licenseplate = $2 LIMIT 1`, [username, vehicleDetails.licensePlate], client);

    if (!verifyOwner || !verifyOwner[0]) {
      throw createHttpError(404, 'Vehicle trying to update is not found.');
    }
    
    const vehicle = await executeQuery(`UPDATE vehicle SET 
      modelname = $1,
      height = $2,
      color = $3 
      WHERE licenseplate = $4 RETURNING *`, 
      [vehicleDetails.model, vehicleDetails.height, vehicleDetails.color, vehicleDetails.licensePlate], client);

    await executeQuery(`DELETE FROM permits WHERE licenseplate = $1`, [vehicleDetails.licensePlate], client);

    let permits = [];
    if (vehicleDetails.permits && vehicleDetails.permits.length) {
      const permitInserts = vehicleDetails.permits.map((p, index) => {
        return `${index !== 0 ? ',' : ''} ($1, $${index + 2})`;
      }).join('');
      permits = await executeQuery(`INSERT INTO permits(licenseplate, permittype) VALUES ` + 
        permitInserts +
        ` RETURNING *`,
      [vehicleDetails.licensePlate, ...vehicleDetails.permits], client);
    }
    
    let plugType = null;
    if (verifyOwner[0].plugtype !== null) {
      plugType = await executeQuery(`UPDATE electricvehicle SET plugtype = $1 WHERE licenseplate = $2 RETURNING *`,
      [vehicleDetails.plugType, vehicleDetails.licensePlate], client);
    }
    
    return {
      licensePlate: verifyOwner[0].licenseplate,
      model: vehicle[0].modelname,
      height: vehicle[0].height, 
      color: vehicle[0].color,
      isElectric: verifyOwner[0].plugtype !== null,
      plugType: verifyOwner[0].plugtype && plugType && plugType[0] ? plugType[0].plugtype : null,
      permits: permits.map((p: {permittype: string}) => p.permittype)
    }
  });
}

async function addVehicle(username: string, vehicle: vehicle) {
  return transaction(async (client: Client) => {
    const userOwnerID = await executeQuery(`SELECT ownerID FROM vehicleOwner WHERE username = $1`, [username], client);
    if(!userOwnerID || !userOwnerID.length) throw createHttpError(404, 'User is not a vehicle owner');

    const id = userOwnerID[0].ownerid;
    const newVehicle = await executeQuery(`INSERT INTO vehicle (licensePlate, modelName, ownerID, height, color) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle.licensePlate, vehicle.model, id, vehicle.height, vehicle.color], client)
    
    const promises = [];
    if (vehicle.isElectric) {
      promises.push(executeQuery(`INSERT INTO electricVehicle (licensePlate, plugType)
      VALUES ($1, $2) RETURNING *`, [vehicle.licensePlate, vehicle.plugType], client));
    }

    if (vehicle.permits && vehicle.permits.length) {
      const permitInserts = vehicle.permits.map((p, index) => {
        return `${index !== 0 ? ',' : ''} ($1, $${index + 2})`;
      }).join('');

      promises.push(executeQuery(`INSERT INTO permits(licenseplate, permittype) VALUES ` + 
        permitInserts +
        ` RETURNING *`,
      [vehicle.licensePlate, ...vehicle.permits], client));
    }

    let [electricVehicle, permits] = await Promise.all(promises);

    return {
      license: vehicle.licensePlate,
      model: vehicle.model,
      height: vehicle.height,
      color: vehicle.color,
      isElectric: vehicle.isElectric,
      plugType: vehicle.plugType,
      permits: vehicle.permits
    };
  });
}

async function deleteVehicle(username: string, vehicle: vehicle) {
  return transaction(async (client: Client) => {
    const userOwnerID = await executeQuery(`SELECT ownerID as id FROM vehicleOwner WHERE username = $1`, [username], client);
    if(!userOwnerID || !userOwnerID.length) {
      throw createHttpError(403, 'User is not a vehicle owner.');
    }
    const returned = await executeQuery(`DELETE FROM vehicle WHERE ownerID = $1 AND licensePlate = $2 RETURNING *`,
      [userOwnerID[0].id, vehicle.licensePlate], client);

    if(returned && returned.length) {
      return {
        license: vehicle.licensePlate,
        model: vehicle.model,
        height: vehicle.height,
        color: vehicle.color,
        isElectric: vehicle.isElectric,
        plugType: vehicle.plugType,
        permits: vehicle.permits
      };
    }
    throw createHttpError(404, 'Vehicle trying to delete is not found');
  });
}

async function getOverview() {
  const [anyLot, allLots, alllotsuser, vehicleOwnersGTA, avg] = await Promise.all([executeQuery(`SELECT COUNT(DISTINCT v.ownerID) AS AnyLot
    FROM parkingSessions ps
    JOIN vehicle v ON ps.licensePlate = v.licensePlate
    WHERE ps.startTime > CURRENT_TIMESTAMP - INTERVAL '60 day'`),
    executeQuery(`SELECT COUNT(DISTINCT v0.ownerID) AS AllLots
    FROM parkingSessions ps0
    JOIN vehicle v0 ON ps0.licensePlate = v0.licensePlate
    WHERE ps0.startTime > CURRENT_TIMESTAMP - INTERVAL '60 day'
        AND NOT EXISTS
            ((SELECT lotID
              FROM parkingSpots)
              EXCEPT
              (SELECT ps1.lotID
               FROM parkingSessions ps1
               JOIN vehicle v1 ON ps1.licensePlate = v1.licensePlate
               WHERE v1.ownerID = v0.ownerID))`),
    executeQuery(`SELECT vo.name, a.email
    FROM parkingSessions ps0
    JOIN vehicle v0 ON ps0.licensePlate = v0.licensePlate
    JOIN vehicleowner vo ON vo.ownerid = v0.ownerid
    JOIN accounts a ON a.username = vo.username
    WHERE ps0.startTime > CURRENT_TIMESTAMP - INTERVAL '60 day'
        AND NOT EXISTS
            ((SELECT lotID
              FROM parkingSpots)
              EXCEPT
              (SELECT ps1.lotID
              FROM parkingSessions ps1
              JOIN vehicle v1 ON ps1.licensePlate = v1.licensePlate
              WHERE v1.ownerID = v0.ownerID))
    GROUP BY vo.name, a.email`),
    executeQuery(`SELECT COUNT(DISTINCT v.licenseplate), vo.name
    FROM vehicleowner as vo 
    INNER JOIN vehicle as v ON vo.ownerid = v.ownerid
    GROUP BY vo.ownerid
    HAVING COUNT(DISTINCT v.licenseplate) > 
    (SELECT AVG(c) 
    FROM (SELECT COUNT(v2.licenseplate) as c
      FROM vehicleowner as vo2 
      INNER JOIN vehicle as v2 ON vo2.ownerid = v2.ownerid
      GROUP BY vo2.ownerid) AS ic
    )`),
    executeQuery(`SELECT AVG(c) as avg
    FROM (SELECT COUNT(v2.licenseplate) as c
      FROM vehicleowner as vo2 
      INNER JOIN vehicle as v2 ON vo2.ownerid = v2.ownerid
      GROUP BY vo2.ownerid) AS ic`)]);

  return {
    ...anyLot[0],
    ...allLots[0],
    alllotsuser: alllotsuser,
    overavg: vehicleOwnersGTA,
    avg: parseFloat(avg[0].avg).toFixed(2)
  }
}

function getLocations() {
  return executeQuery(`SELECT pl.lotID, l.postalCode, l.city, l.province 
    FROM location l, parkingLots pl
    WHERE l.postalCode = pl.postalCode`);
}

function getParkingHistory(username: string, licensePlate: string | null | undefined, attr: string[]): any {
  let projectionAttr = '';
  if(attr && attr.length) {
    projectionAttr = attr.join(', ');
    projectionAttr += ', ';
  }

  let query = `SELECT
        p.lotID AS parkingLotId,
        p.startTime,
        p.isActive,
        p.sessionid,
        CONCAT(l.postalCode, ' ', l.city, ', ', l.province) AS parkingLotAddress,
        p.licensePlate AS vehicleLicensePlate, ` + projectionAttr + 
        `CASE
            WHEN a.accessibilityType IS NOT NULL THEN a.accessibilityType
        END AS accessibilityType,
        CASE
            WHEN a.accessibilityType IS NULL THEN FALSE
            ELSE TRUE
        END AS isAccessibilitySpot,
        CASE
            WHEN e.plugType IS NULL THEN FALSE
            ELSE TRUE
        END AS isElectricSpot,
        (SELECT MIN(pa.timestamp) FROM parkingactivities as pa WHERE pa.timestamp > p.starttime 
          AND pa.licenseplate = p.licenseplate 
          AND pa.lotid = p.lotid
          AND pa.spotid = p.spotid
          AND pa.activitytype IN ('removed', 'out')) as sessionend,
        t.ticketnumber
    FROM parkingSessions p
    JOIN parkingSpots ps
        ON p.spotID = ps.spotID AND p.lotID = ps.lotID
    JOIN parkingLots pl
        ON ps.lotID = pl.lotID
    JOIN location l
        ON pl.postalCode = l.postalCode
    JOIN vehicle v
        ON p.licensePlate = v.licensePlate
    JOIN vehicleOwner vo
        ON v.ownerID = vo.ownerID
    LEFT JOIN accessibilitySpots a
        ON p.spotID = a.spotID AND p.lotID = a.lotID
    LEFT JOIN electricSpots e
        ON p.spotID = e.spotID AND p.lotID = e.lotID
    LEFT JOIN tickets t
        ON t.sessionid = p.sessionid
    WHERE vo.username = $1 `;

  if (licensePlate !== null && licensePlate !== undefined) {
    return executeQuery(query + ` AND p.licensePlate = $2 ORDER BY p.isActive DESC, p.startTime DESC`, [username, licensePlate]);
  } else {
    return executeQuery(query + ` ORDER BY p.isActive DESC, p.startTime DESC`, [username]);
  }
}

async function getParkingLotStats(lotId: number) {

  const userTickets5 = executeQuery(`SELECT vo.name, a.email, COUNT(DISTINCT t.ticketnumber) as num_tickets
      FROM tickets as t
      INNER JOIN parkingsessions as ps ON ps.sessionid = t.sessionid
      INNER JOIN vehicle as v ON v.licenseplate = ps.licenseplate
      INNER JOIN vehicleowner as vo ON vo.ownerid = v.ownerid
      INNER JOIN accounts as a ON a.username = vo.username
      WHERE ps.lotid = $1 
          AND ps.startTime > CURRENT_TIMESTAMP - INTERVAL '60 day'
      GROUP BY a.username, vo.ownerid
      HAVING COUNT(DISTINCT t.ticketnumber) > 3`, [lotId]);

  const averageParkingPerDay = executeQuery(`SELECT SUM(count)/60 as average FROM
      (SELECT COUNT(DISTINCT pa.licenseplate) as count FROM parkingactivities as pa
      WHERE pa.timestamp > CURRENT_TIMESTAMP - INTERVAL '60 day' 
          AND pa.activitytype = 'in' 
          AND pa.lotid = $1
      GROUP BY pa.timestamp::DATE) as cbd`, [lotId]);

  const userParked10 = executeQuery(`SELECT vo.name, a.email, COUNT(*) as parked
      FROM parkingactivities as pa
      INNER JOIN vehicle as v ON v.licenseplate = pa.licenseplate
      INNER JOIN vehicleowner as vo ON vo.ownerid = v.ownerid
      INNER JOIN accounts as a ON a.username = vo.username
      WHERE pa.timestamp > CURRENT_TIMESTAMP - INTERVAL '60 day' 
          AND pa.activitytype = 'in' 
          AND pa.lotid = $1
      GROUP BY a.username, vo.ownerid
      HAVING COUNT(*) > 3`, [lotId]);

  const result: any[] = await Promise.all([userTickets5, averageParkingPerDay, userParked10]);
  return {
    tickets: result[0],
    averagePark: (Math.round(parseFloat(result[1][0].average || '0') * 100)/100).toFixed(2),
    parked: result[2],
  };
}

async function getParkingSpots(filters: spotFilter) {
  return transaction(async (client: Client) => {
    const vehicle = await executeQuery(`SELECT v.*, ev.plugType, ARRAY_AGG(p.permittype) as permits FROM vehicle as v
    LEFT JOIN permits as p ON p.licenseplate = v.licenseplate
    LEFT JOIN electricvehicle as ev ON ev.licenseplate = v.licenseplate
    WHERE v.licenseplate = $1
    GROUP BY v.licenseplate, ev.plugtype LIMIT 1`, [filters.licensePlate], client);

    if(!vehicle?.length) {
      throw createHttpError(404, 'Vehicle not found');
    }

    let andClauses = '';
    let args = [vehicle[0].height];
    if(filters.needsCharging === "true" && vehicle[0].plugtype) {
      andClauses += ` AND es.plugType = $${args.length + 1}`;
      args.push(vehicle[0].plugtype);
    } else {
      andClauses += ` AND es.plugType IS NULL `;
    }

    if(filters.location) {
      andClauses += ` AND pl.lotid = $${args.length + 1}`;
      args.push(parseInt(filters.location, 10));
    }

    if(filters.duration) {
      andClauses += ` AND ps.availabletime >= $${args.length + 1}`;
      args.push(filters.duration);
    }


    
    if(filters.accessType) {
      andClauses += ` AND accs.accessibilitytype = $${args.length + 1}`;
      args.push(filters.accessType);
    } else {
      let permits_str = ``;
      vehicle[0].permits.forEach((p:string, index:number) => {
        permits_str += `${index !== 0 ? ',' : ''} $${args.length + 1 + index}`;
      });
      andClauses += ` AND (accs.accessibilitytype IS NULL OR accs.accessibilitytype IN ( ` + permits_str + `) )`;
      args.push(...vehicle[0].permits);
    }

    if(filters.spotType) {
      andClauses += ` AND ps.spottype = $${args.length + 1}`;
      args.push(filters.spotType);
    } else {
      let permits_str = ``;
      vehicle[0].permits.forEach((p:string, index:number) => {
        permits_str += `${index !== 0 ? ',' : ''} $${args.length + 1 + index}`;
      });
      andClauses += ` AND ps.spottype IN ('normal', ` + permits_str + `)`;
      args.push(...vehicle[0].permits);
    }
   
    const results = await executeQuery(`SELECT ps.spotid,
      pl.lotid,
      ps.availabletime, 
      es.plugType,
      accs.accessibilitytype,
      pl.postalcode,
      l.city,
      l.province,
      ps.spottype
      FROM parkingspots as ps 
      INNER JOIN parkinglots as pl ON pl.lotid = ps.lotid
      INNER JOIN location as l ON l.postalcode = pl.postalcode
      LEFT JOIN electricspots as es ON es.spotid = ps.spotid AND es.lotid = ps.lotid
      LEFT JOIN accessibilityspots as accs ON accs.spotid = ps.spotid AND accs.lotid = ps.lotid
      WHERE (pl.heightlimit IS NULL OR pl.heightlimit >= $1)
          AND (ps.height IS NULL OR ps.height >= $1)` + andClauses, args, client);
    
    return results;
  });
}

async function checkSessionAndIssueTickets() {
  return transaction(async (client: Client) => {
    const ticketCost = Math.round(Math.random() * 100);
    const expiredSessions = await executeQuery(`UPDATE parkingsessions
      SET isactive = false
      WHERE isactive = true
          AND (starttime + allottedtime * interval '1 second') < CURRENT_TIMESTAMP
      RETURNING *`, [], client);
    if(expiredSessions && expiredSessions.length) { // Add parking activities kicked out, add tickets
      let ticketInserts = expiredSessions.map((p, index) => {
        return `${index !== 0 ? ',' : ''} ($1, 'Parked overtime.', $${index + 2})`;
      }).join('');
  
      const promises = [executeQuery(`INSERT INTO tickets(cost, details, sessionid) VALUES ` + ticketInserts,
         [ticketCost, ...expiredSessions.map(s => s.sessionid)], client)];
  
  
      expiredSessions.forEach((p) => {
        promises.push(executeQuery(`INSERT INTO parkingactivities(timestamp, licenseplate, spotid, lotid, activitytype) VALUES 
          ($1, $2, $3, $4, 'removed')`, [(new Date(new Date(p.starttime).getTime() + p.allottedtime * 1000)).toISOString(), p.licenseplate, p.spotid, p.lotid], client));
      });
  
      return Promise.all(promises);
    }
  });
}

function getTicketHistory(username: string, licensePlate: string | null | undefined, attr: string[]): any {
  let projectionAttr = '';
  if(attr && attr.length) {
    projectionAttr = attr.join(', ');
    projectionAttr += ', ';
  }
  // t.ticketNumber,
  // p.sessionid,
  // t.details
  
  let query = `SELECT p.licensePlate,
           p.startTime + (p.allottedTime / 3600 * interval '1 hour') AS dateReceived,
           t.paid, ` + projectionAttr +
           `t.ticketnumber
    FROM parkingSessions p
    JOIN vehicle v
        ON p.licensePlate = v.licensePlate
    JOIN vehicleOwner vo
        ON v.ownerID = vo.ownerID
    JOIN tickets t
        ON p.sessionID = t.sessionID
    WHERE vo.username = $1 `;

  if (licensePlate !== null && licensePlate !== undefined) {
    return executeQuery(query + ` AND p.licensePlate = $2`, [username, licensePlate]);
  } else {
    return executeQuery(query, [username]);
  }
}

function getSummary(username: string, licensePlate: string | null | undefined, attr: string[]): any {
  let projectionAttr = '';
  if(attr && attr.length) {
    projectionAttr = attr.join(', ');
    projectionAttr += ', ';
  }

  let query = `SELECT
        p.lotID AS parkingLotID, ` +
        projectionAttr +
        ` p.licensePlate AS vehicleLicensePlate,
        COUNT(DISTINCT p.sessionID) AS count
    FROM parkingSessions p
    JOIN parkingSpots ps
        ON p.spotID = ps.spotID AND p.lotID = ps.lotID
    JOIN parkingLots pl
        ON ps.lotID = pl.lotID
    JOIN location l
        ON pl.postalCode = l.postalCode
    JOIN vehicle v
        ON p.licensePlate = v.licensePlate
    JOIN vehicleOwner vo
        ON v.ownerID = vo.ownerID
    WHERE vo.username = $1 `;

  if (licensePlate !== null && licensePlate !== undefined) {
    return executeQuery(query + ` AND p.licensePlate = $2 GROUP BY p.licensePlate, p.lotID, l.postalCode`, [username, licensePlate]);
  } else {
    return executeQuery(query + ` GROUP BY p.licensePlate, p.lotID, l.postalCode`, [username]);
  }
}

function createParkingSession(lotId: number, spotId: number, licensePlate: string, username: string) {
  return transaction(async (client: Client) => {
    const vehicle = await executeQuery(`SELECT ev.plugtype,
      v.height,
      array_agg(p.permittype) as permits
      FROM accounts as a
      INNER JOIN vehicleowner as vo ON vo.username = a.username
      INNER JOIN vehicle as v ON v.ownerid = vo.ownerid
      LEFT JOIN electricvehicle as ev ON ev.licenseplate = v.licenseplate
      LEFT JOIN permits as p ON p.licenseplate = v.licenseplate
      WHERE a.username = $1
        AND v.licenseplate = $2
      GROUP BY ev.plugtype, v.height`, [username, licensePlate], client);
      
    if(!vehicle || !vehicle.length) {
      throw createHttpError(404, 'Vehicle not found.');
    }

    const activeSession = await executeQuery(`SELECT * FROM parkingsessions 
      WHERE isactive = true and licenseplate = $1`, [licensePlate], client);

    if(activeSession && activeSession.length) {
      throw createHttpError(403, 'User is already parked somewhere else');
    }

    const parkingSpace = await executeQuery(`SELECT 
      ps.spottype,
      ps.height,
      pl.heightlimit,
      es.plugtype,
      accs.accessibilitytype,
      ps.availabletime
      FROM parkinglots as pl
      INNER JOIN parkingspots as ps ON ps.lotid = pl.lotid
      LEFT JOIN electricspots as es ON es.lotid = ps.lotid AND es.spotid = ps.spotid
      LEFT JOIN accessibilityspots as accs ON accs.lotid = ps.lotid AND accs.spotid = ps.spotid
      WHERE pl.lotid = $1
        AND ps.spotid = $2`, [lotId, spotId], client);

    if(!parkingSpace || !parkingSpace.length) {
      throw createHttpError(404, 'Parking spot not found');
    }

    if(parkingSpace[0].plugtype && parkingSpace[0].plugtype !== vehicle[0].plugtype) {
      throw createHttpError(403, `Vehicle does not have the right electric plug for the spot`);
    } else if (parkingSpace[0].height && parkingSpace[0].height < vehicle[0].height) {
      throw createHttpError(403, `Vehicle height cannot fit in the spot`);
    } else if (parkingSpace[0].heightlimit && parkingSpace[0].heightlimit < vehicle[0].height) {
      throw createHttpError(403, `Vehicle height cannot fit inthe parking lot`);
    } else if (parkingSpace[0].accessibilitytype && !(vehicle[0].permits.includes(parkingSpace[0].accessibilitytype))) {
      throw createHttpError(403, `Vehicle does not have the permit to park in this spot`);
    } else if (parkingSpace[0].spottype && parkingSpace[0].spottype !== 'normal' && !(vehicle[0].permits.includes(parkingSpace[0].spottype))) {
      throw createHttpError(403, `Vehicle does not have the permit to park in this spot`);
    }

    // create session
    return Promise.all([
      executeQuery(`INSERT INTO parkingsessions(licenseplate, spotid, lotid, allottedtime, isactive, starttime, ischarging) 
        VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, $5)`,
        [licensePlate, spotId, lotId, parkingSpace[0].availabletime, parkingSpace[0].plugtype !== null], client),
      executeQuery(`INSERT INTO parkingactivities(timestamp, licenseplate, spotid, lotid, activitytype)
        VALUES (CURRENT_TIMESTAMP, $1, $2, $3, 'in')`, 
        [licensePlate, spotId, lotId], client)
    ])
  });
}

function endParkingSession(sessionid: number, username: string) {
  return transaction(async (client: Client) => {
    const session = await executeQuery(`SELECT * FROM parkingsessions as ps
      INNER JOIN vehicle as v ON v.licenseplate = ps.licenseplate
      INNER JOIN vehicleowner as vo ON vo.ownerid = v.ownerid
      WHERE ps.sessionid = $1 AND vo.username = $2 AND isactive = true`, [sessionid, username], client);

    if(!session || !session.length) {
      throw createHttpError(404, `Session not found`);
    }

    return Promise.all([
      executeQuery(`UPDATE parkingsessions SET isactive = false WHERE sessionid = $1`, [sessionid], client),
      executeQuery(`INSERT INTO parkingactivities(timestamp, licenseplate, spotid, lotid, activitytype) VALUES
        (CURRENT_TIMESTAMP, $1, $2, $3, 'out')`, [session[0].licenseplate, session[0].spotid, session[0].lotid], client)
    ]);
  });
}

function getTotalCost(username: string, licensePlate: string) {
  return executeQuery(`SELECT SUM(t.cost) AS totalCost
    FROM parkingSessions p
    JOIN tickets t  
        ON p.sessionID = t.sessionId
    JOIN vehicle v
        ON p.licensePlate = v.licensePlate
    JOIN vehicleOwner vo
        ON v.ownerID = vo.ownerID
    WHERE vo.username = $1 AND p.licensePlate = $2`, [username, licensePlate]);
}

function getNumTickets(username: string, licensePlate: string) {
  return executeQuery(`SELECT COUNT(t.sessionID) AS numTickets
    FROM parkingSessions p
    JOIN tickets t
        ON p.sessionID = t.sessionId
    JOIN vehicle v
        ON p.licensePlate = v.licensePlate
    JOIN vehicleOwner vo
        ON v.ownerID = vo.ownerID
    WHERE vo.username = $1 AND p.licensePlate = $2`, [username, licensePlate]);
}

export default {
  getParkingLots,
  getAccount,
  getUserProfile,
  executeQuery,
  updateUserProfile,
  getVehicles,
  getPermits,
  getModels,
  getPlugTypes,
  updateVehicle,
  getAccessTypes,
  getSpotTypes,
  addVehicle,
  deleteVehicle,
  getOverview,
  getLocations,
  getParkingHistory,
  getParkingLotStats,
  getParkingSpots,
  checkSessionAndIssueTickets,
  getTicketHistory,
  getSummary,
  createParkingSession,
  endParkingSession,
  getTotalCost,
  getNumTickets
}
