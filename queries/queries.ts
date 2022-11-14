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
  return executeQuery(`SELECT vo.name, vo.address, pd.phoneNumber, pd.pronouns, pd.gender, pd.dob
    FROM vehicleOwner as vo 
    JOIN personalDetails as pd 
      ON pd.ownerID = vo.ownerID
    WHERE vo.username = $1 LIMIT 1`, [username]);
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
    phoneNumber: updatedDetails[0].phoneNumber,
    address: updatedDetails[0].address,
    pronouns: updatedDetails[0].pronouns,
    gender: updatedDetails[0].gender,
    dob: updatedDetails[0].dob
  };
}

export default {
  getParkingLots,
  getAccount,
  getUserProfile,
  executeQuery,
  updateUserProfile
}