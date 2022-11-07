import pool from '../util/dbConnect.js';

function executeQuery(query: string): any {
  return pool.query(query).then(res => res.rows);
}

function getParkingLots(): any {
  return executeQuery(`SELECT * FROM parkingLots`);
}

export default {
  getParkingLots
}