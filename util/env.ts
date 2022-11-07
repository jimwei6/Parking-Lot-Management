import dotenv from 'dotenv';
dotenv.config();

export default {
  PG_USER: process.env.PG_USER,
  PG_HOST: process.env.PG_HOST,
  PG_DB: process.env.PG_DB,
  PG_PASS: process.env.PG_PASS,
  PG_PORT: process.env.PG_PORT,
  PG_REMOTE: process.env.PG_REMOTE,
  PG_USE_REMOTE: process.env.PG_USE_REMOTE,
  PORT: process.env.PORT
}