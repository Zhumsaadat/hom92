import cors from 'cors';
import express, {Router} from 'express';
import mongoose from "mongoose";
import config from "./config";
import usersRouter from "./routers/users";
import expressWs from "express-ws";
import {connections, IncomingMessage, UserTypes} from "./types";
import User from "./models/User";

const app = express();
const chatRouter = Router();

const port = 8000;
expressWs(app);

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);



const run = async () => {
    await  mongoose.connect(config.mongoose.db)

    app.listen(port, () => {
        console.log(`server started on ${port} port`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();