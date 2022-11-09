import {
  Request,
  Response,
  Router
} from 'express';
import util from '../util/index';
import queries from '../queries/queries';
import createHttpError from 'http-errors';

const router = Router();
router.use(util.authenticateAccount()); // saves account info to res.locals

router.get('/parkingLot', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const parkingLots = await queries.getParkingLots();
  res.json({
    result: parkingLots
  })
}));

router.get('/profile', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const profile = await queries.getUserProfile(res.locals.account.username);
  res.json({
    ...profile,
    email: res.locals.account.email
  })
}))

export default router;