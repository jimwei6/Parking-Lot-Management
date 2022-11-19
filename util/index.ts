import createHttpError from 'http-errors';
import queries from '../queries/queries';
import { Request, Response } from 'express';
import pool from './dbConnect';

function asyncHandler(asyncFunction: Function) {
    return async (req: Request, res: Response, next: Function) => Promise.resolve(asyncFunction(req, res, next).catch(next));
}

function authenticateAccount() {
    return asyncHandler(async (req: Request, res: Response, next: Function) => {
        const cookie: { username: string, password: string } = req.cookies as { username: string, password: string };
        if (cookie.username && cookie.password) {
            const account = await queries.getAccount(cookie.username, cookie.password);
            if (account && account[0]) {
                res.locals.account = account[0];
                return next();
            }
        }
        return next(createHttpError(401, "Not authenticated"));
    });
}

function testDBConnection() {
  return asyncHandler(async (req: Request, res: Response, next: Function) => { 
    try {
      const client = await pool.connect();
      client.release();
      next();
    } catch(error) {
      console.log(error);
      return next(createHttpError(500, "Server cannot connect to Database"));
    }
  })
}

export default {
    asyncHandler,
    authenticateAccount,
    testDBConnection
}