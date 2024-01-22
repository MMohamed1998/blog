import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import chalk from 'chalk'
import cors from 'cors';
import connectionDB from './database/connection.js'
import morgan from "morgan";
import authRouter from "./src/modules/auth/auth.router.js";
import blogRouter from "./src/modules/blog/blog.router.js";
import {globalErrorHandling} from "./utils/errorHandling.js";
const app = express()
app.use(express.json({}));
const port = 5555
app.use(morgan("dev"));

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
app.use(cors());



app.use("/uploads", express.static("uploads"));

  app.use(`/auth`, authRouter);
  app.use(`/blogs`, blogRouter);
app.all("*", (req, res, next) => {
    res.status(500).send("In-valid Routing Plz check url  or  method");
  });
 app.use(globalErrorHandling);
connectionDB()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(chalk.bgBlueBright(`Example app listening on port ${port}!`)))