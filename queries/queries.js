import pool from '../util/dbConnect.js';

function executeQuery(query) {
  return pool.query(query).then(res => res.rows);
}

function getParkingLots() {
  return executeQuery(`SELECT * FROM parkingLots`);
}

export default {
  getParkingLots
}