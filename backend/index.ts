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

const port = 8080;
expressWs(app);

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);

const activeConnections: connections = {};
chatRouter.ws('/', (ws, req) => {
    let user: UserTypes | null;

    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;

        if (parsedMessage.type === 'LOGIN') {
            user = await User.findOne({token: parsedMessage.payload});

            console.log(user);
            if (user) {
                activeConnections[user.token] = ws;
            }

        } else if (parsedMessage.type === 'SEND_MESSAGE') {
            Object.values(activeConnections).forEach(connection => {
                const msg = {type: 'NEW_MESSAGE', payload: {
                        author: user?.displayName,
                        message: parsedMessage.message,
                    }};

                connection.send(JSON.stringify(msg));
            });
        }
    });
});

app.use('/chat', chatRouter);

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