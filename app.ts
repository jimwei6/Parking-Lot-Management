import express from "express";
import morgan from "morgan";
import env from "./util/env";
import apiRoutes from './routes/api';
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import createHttpError from 'http-errors';
import util from "./util/index";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port: string | number = env.PORT || 3500;

app.use(express.json());
app.use(morgan('short')); // for logging
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

util.testDBConnection().then(() => {
  //routes
  app.use('/api', apiRoutes);
  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);

  app.get('/', (req: express.Request, res: express.Response) => {
      res.json({
          message: "Hello World"
      })
  });

  app.get('*', (req: express.Request, res: express.Response, next: Function) => {
      next(createHttpError(404, "Not Found"));
  });

  app.use((error: Error, req: express.Request, res: express.Response, next: Function) => {
      const err = error as createHttpError.HttpError;
      console.log(err);
      res.status(err.status || 500).json({
          error: error.message,
      });
  });

  app.listen(port, () => {
      console.log(`App started on port ${port}`);
  });
}).catch(error => {
  console.error(`Failed to connect to database. App not started.`);
  throw error
});

