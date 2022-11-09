import pool from '../util/dbConnect.js';

function executeQuery(query: string, values: string[] = []): any {
  return pool.query(query, values).then(res => res.rows);
}

function getParkingLots(): any {
  return executeQuery(`SELECT * FROM parkingLots`);
}

function getAccount(username: string, password: string): any {
  return executeQuery(`SELECT * FROM accounts WHERE username = $1 AND password = $2`, [username, password]);
}
export default {
  getParkingLots,
  getAccount
}