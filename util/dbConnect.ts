import pg, { Pool, PoolConfig } from 'pg';
import env from './env';

let pool: Pool;

const connectionString: string | undefined = env.PG_REMOTE;
const config: PoolConfig = {
  user: env.PG_USER,
  host: env.PG_HOST,
  database: env.PG_DB,
  password: env.PG_PASS,
  port: env.PG_PORT ? parseInt(env.PG_PORT) : 5432
}

pool = connectionString && env.PG_USE_REMOTE == '1' ?
  new pg.Pool({
    connectionString,
  }) : new pg.Pool(config)

export default pool;