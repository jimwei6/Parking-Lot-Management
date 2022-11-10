import {
  Request,
  Response,
  Router
} from 'express';
import util from '../util/index';
import queries from '../queries/queries';
import createHttpError from 'http-errors';
import fs from 'fs';

const router = Router();

router.get('/rebuildDB',  util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const files = ['clear_db.sql', 'init_table.sql', 'init_base_data.sql', 'init_user_data.sql'];
  await queries.executeQuery(fs.readFileSync('./sql_scripts/' + files[0]).toString());
  await queries.executeQuery(fs.readFileSync('./sql_scripts/' + files[1]).toString());
  await queries.executeQuery(fs.readFileSync('./sql_scripts/' + files[2]).toString());
  await queries.executeQuery(fs.readFileSync('./sql_scripts/' + files[3]).toString());

  res.json({
    message: 'successfully ran cockroach rebuild'
  })
}));

export default router;