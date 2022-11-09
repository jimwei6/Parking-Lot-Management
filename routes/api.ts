import {
  Request,
  Response,
  Router
} from 'express';
import util from '../util/index.js';
import queries from '../queries/queries.js';
import createHttpError from 'http-errors';

const router = Router();

router.get('/example', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const parkingLots = await queries.getParkingLots();
  console.log(parkingLots);
  res.json({
    parkingLots: parkingLots
  })
}));

router.get('/authenticate', util.asyncHandler(async (req: Request, res: Response, next: Function) => {
  const query: { username: string, password: string } = req.query as { username: string, password: string};
  if(query.username && query.password) {
    const hasAccount = await queries.getAccount(query.username, query.password);
    if(hasAccount && hasAccount[0]) {
      return res.json({
        authenticated: true
      })
    } else {
      next(createHttpError(401, 'Login credentials are incorrect'))
    }
  }
  next(createHttpError(400, 'Missing uername or password'));
}));

export default router;