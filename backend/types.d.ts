import {Model} from "mongoose";
import {WebSocket} from 'ws';

export interface UserTypes {
    email: string;
    password: string;
    token: string;
    displayName: string;
    googleID: string;
    role: string;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserTypes, {}, UserMethods>;

export interface connections {
    [key: string]: WebSocket;
}

export interface IncomingMessage {
    type: string;
    payload: string;
    message: string;
}