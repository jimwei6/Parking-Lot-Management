import pg from 'pg';
import env from './env.js';

const connectionString = env.PG_REMOTE
const pool = connectionString && env.PG_USE_REMOTE ?
  new pg.Pool({
    connectionString,
  }) : new pg.Pool({
    user: env.PG_USER,
    host: env.PG_HOST,
    database: env.PG_DB,
    password: env.PG_PASS,
    port: env.PG_PORT
  })

export default pool;