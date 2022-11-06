import pg from "pg";
import env from "./env.js";

const pool = new pg.Pool({
  user: env.PG_USER,
  host: env.PG_HOST,
  database: env.PG_DB,
  password: env.PG_PASS,
  port: env.PG_PORT
})

export default pool;