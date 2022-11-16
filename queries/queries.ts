import { profile } from '../util/types';
import pool from '../util/dbConnect';

function executeQuery(query: string, values: string[] = []): any {
  return pool.query(query, values).then(res => res.rows).catch(error => {
    console.error(error);
  });
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
  const [updatedAccount, updatedVO] = await Promise.all([
    executeQuery(`UPDATE accounts SET password = $1, email = $2 WHERE username = $3 RETURNING *`, [profile.password, profile.email, username]),
    executeQuery(`UPDATE vehicleOwner SET 
      address = $1, name = $2
      WHERE username = $3 RETURNING *`, 
      [profile.address, profile.name, username])
  ]);

  const updatedDetails = await executeQuery(`UPDATE personalDetails SET dob = $1, gender = $2, phoneNumber = $3, pronouns = $4
    WHERE ownerID = $5 RETURNING *`, 
    [new Date(profile.dob).toLocaleDateString('en-CA'), profile.gender,
      profile.phoneNumber, profile.pronouns, updatedVO[0].ownerid]);
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
}

function getUserVehicles(username: string, licensePlate: string | null | undefined): any {
  let query = `SELECT
      v.licensePlate,
      v.modelName AS model,
      v.height,
      v.color,
      ev.plugType,
      array_agg(p.permitType) AS permit,
      CASE
          WHEN ev.plugType = NULL THEN FALSE
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

  if(licensePlate !== null && licensePlate !== undefined) {
    return executeQuery(query + 
      ` AND v.licensePlate = $2 GROUP BY v.licensePlate, ev.plugType`, [username, licensePlate]);
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

export default {
  getParkingLots,
  getAccount,
  getUserProfile,
  executeQuery,
  updateUserProfile,
  getUserVehicles,
  getPermits,
  getModels,
  getPlugTypes
}