import {
  Request,
  Response,
  Router
} from 'express';
import util from '../util/index';
import queries from '../queries/queries';
import createHttpError from 'http-errors';
import { profile } from '../util/types';

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
    ...profile[0]
  })
}));

router.put('/profile', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  try {
    const newProfile: profile = req.body;
    const profile: profile = await queries.updateUserProfile(res.locals.account.username, newProfile);
    return res.json({
      ...profile
    });
  } catch(error) {
    console.error(error);
    return next(createHttpError(400, 'Failed to update user profile'));
  };
}));

router.get('/vehicle', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const userVehicles = await queries.getUserVehicles(res.locals.account.username);
  res.json({
    result: userVehicles
  })
}));

export default router;