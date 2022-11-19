import {
  Request,
  Response,
  Router
} from 'express';
import util from '../util/index';
import queries from '../queries/queries';
import createHttpError from 'http-errors';
import { profile, vehicle } from '../util/types';

const router = Router();
router.use(util.testDBConnection());
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
  }
}));

router.get('/vehicle', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const param: {licensePlate: string} = req.query as {licensePlate: string};
  const userVehicles = await queries.getVehicle(res.locals.account.username, param ? param.licensePlate : null);
  res.json({
    result: userVehicles
  })
}));

router.get('/types', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const [permits, plugTypes, models] = await Promise.all([queries.getPermits(), queries.getPlugTypes(), queries.getModels()]);
  res.json({
    permits: permits.map((p: {title: string}) => p.title),
    plugTypes: plugTypes.map((p: {plugtype: string}) => p.plugtype),
    models: models.map((p: {modelname: string}) => p.modelname),
    spotTypes: queries.getSpotTypes(),
    accessTypes: queries.getAccessTypes()
  })
}));

router.put('/vehicle', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  try {
    const vehicleDetails: vehicle = req.body as vehicle;
    const updatedVehicle = await queries.updateVehicle(res.locals.account.username, vehicleDetails);
    res.json({
      ... updatedVehicle
    })
  } catch(err) {
    console.error(err);
    next(createHttpError(400, "Failed to update vehicle details."));
  }
}));

router.post('/vehicle', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  try {
    const newUserVehicle: vehicle = req.body;
    const userVehicle = await queries.addVehicle(res.locals.account.username, newUserVehicle);
    return res.json({
      ...userVehicle
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(400, 'Failed to add user vehicle'));
  }
}));

router.delete('/vehicle', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  try {
    const deleteUserVehicle: vehicle = req.body;
    const userVehicle = await queries.deleteVehicle(res.locals.account.username, deleteUserVehicle);
    return res.json({
      ...userVehicle
    })
  } catch (error) {
    console.error(error);
    return next(createHttpError(400, 'Failed to delete user vehicle'));
  }
}));

export default router;