import express from "express";
import morgan from "morgan";
import env from "./util/env.js";
import apiRoutes from './routes/api.js';
import createHttpError from 'http-errors';

const app = express();
const port: string | number = env.PORT || 3000;

app.use(morgan('short')); // for logging

//routes
app.use('/api', apiRoutes);
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: "Hello World"
  })
});

app.get('*', (req: express.Request, res: express.Response, next: Function) => {
  next(createHttpError(404, "Not Found"));
});

app.use((error:Error, req: express.Request, res: express.Response, next: Function) => {
  const err = error as createHttpError.HttpError;
  res.status(err.status).json({
    error: error.message,
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});