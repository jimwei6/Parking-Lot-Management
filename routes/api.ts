import {
  Request,
  Response,
  Router
} from 'express';
import util from '../util/index.js';
import queries from '../queries/queries.js';

const router = Router();

router.get('/example', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const parkingLots = await queries.getParkingLots();
  console.log(parkingLots);
  res.json({
    parkingLots: parkingLots
  })
}));

export default router;