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
      ON pd.name = vo.name AND pd.address = vo.address
    WHERE vo.username = $1 LIMIT 1`, [username]);
}

export default {
  getParkingLots,
  getAccount,
  getUserProfile,
  executeQuery
}