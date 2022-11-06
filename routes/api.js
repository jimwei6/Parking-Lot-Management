import {
  Router
} from 'express';
import util from '../util/index.js';
import queries from '../queries/queries.js';

const router = Router();

router.get('/example', util.asyncHandler(async (req, res, next) => {
  const parkingLots = await queries.getParkingLots();
  console.log(parkingLots);
  res.json({
    parkingLots: parkingLots
  })
}));


export default router;