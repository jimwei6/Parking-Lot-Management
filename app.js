import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(morgan('short'));

app.get('/', (req, res) => {
  res.json({
    message: "Hello World"
  })
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.json({
    error: error.message,
  });
});