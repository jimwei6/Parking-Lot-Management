import { profile, vehicle } from '../util/types';
import pool from '../util/dbConnect';
import createHttpError from 'http-errors';
import { Client } from 'pg';

async function executeQuery(query: string, values: string[] = [], client: Client | null = null) {
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
      VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle.licensePlate, vehicle.model, id, vehicle.height, vehicle.color])
    
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
  const [anyLot, allLots] = await Promise.all([executeQuery(`SELECT COUNT(DISTINCT v.ownerID) AS AnyLot
    FROM parkingSessions ps
    JOIN vehicle v ON ps.licensePlate = v.licensePlate
    WHERE ps.startTime > CURRENT_TIMESTAMP - INTERVAL '30 day'`),
    executeQuery(`SELECT COUNT(DISTINCT v0.ownerID) AS AllLots
    FROM parkingSessions ps0
    JOIN vehicle v0 ON ps0.licensePlate = v0.licensePlate
    WHERE ps0.startTime > CURRENT_TIMESTAMP - INTERVAL '30 day'
        AND NOT EXISTS
            ((SELECT lotID
              FROM parkingSpots)
              EXCEPT
              (SELECT ps1.lotID
               FROM parkingSessions ps1
               JOIN vehicle v1 ON ps1.licensePlate = v1.licensePlate
               WHERE v1.ownerID = v0.ownerID))`)]);
  return {
    ...anyLot[0],
    ...allLots[0]
  }
}

function getLocations() {
  return executeQuery(`SELECT pl.lotID, l.postalCode, l.city, l.province 
    FROM location l, parkingLots pl
    WHERE l.postalCode = pl.postalCode`)
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
  getLocations
}
