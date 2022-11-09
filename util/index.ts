import createHttpError from 'http-errors';
import queries from '../queries/queries';
import {
  Request,
  Response
} from 'express';

function asyncHandler(asyncFunction: Function) {
  return async (req: Request, res: Response, next: Function) => Promise.resolve(asyncFunction(req, res, next).catch(next));
}

function authenticateAccount() {
  return asyncHandler(async (req: Request, res: Response, next: Function) => {
    const cookie: { username: string } = req.cookies as { username: string };
    if(cookie.username) {
      const account = queries.getAccount(cookie.username);
      if(account && account[0]) {
        res.locals.account = account[0];
      }
    }
    return next(createHttpError(401, "Not authenticated"));
  });
}

export default {
  asyncHandler,
  authenticateAccount
}