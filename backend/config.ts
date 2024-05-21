import path from "path";
import {configDotenv} from "dotenv";

configDotenv();

const rootPath = __dirname;

const config = {
    rootPath,
    mongoose: {
        db: 'mongodb://localhost/chats',
    },
    publicPath: path.join(rootPath, 'public'),
    google: {
        clientId: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    },
};

export default config;