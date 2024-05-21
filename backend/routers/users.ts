import {Router} from "express";
import User from "../models/User";
import mongoose, {mongo} from "mongoose";
import {OAuth2Client} from "google-auth-library";
import config from "../config";

const usersRouter = Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.get('/', async (_req, res, next) => {
    try {
        const users = await User.find().select('-token');

        return res.send(users);
    } catch (err) {
        return next();
    }
});

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
            role: req.body.role,
        });

        user.generateToken();
        await user.save();

        return res.send({message: 'ok!', user});
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(err);
        }

        if (err instanceof mongo.MongoServerError && err.code === 11000) {
            return res.status(422).send({message: 'email should be unique'});
        }

        return next(err);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(422).send({error: 'email and/or password not found!'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if(!isMatch) {
            return res.status(422).send({error: 'email and/or password not found!'});
        }

        user.generateToken();
        await user.save();

        return res.send({message: 'email and password are correct!', user});
    } catch (err) {
        return next(err);
    }
});

usersRouter.post('/google', async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).send({error: 'Google login error!'});
        }

        const email = payload['email'];
        const id = payload['sub'];
        const displayName = payload['name'];

        if (!email) {
            return res.status(400).send({error: 'Email is not present'});
        }

        let user = await User.findOne({googleID: id});

        if (!user) {
            user = new User({
                email,
                password: crypto.randomUUID(),
                googleID: id,
                displayName,
            });
        }

        user.generateToken();
        await user.save();

        return res.send({message: 'Login with Google successful!', user});
    } catch (err) {
        return next(err);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const headerValue = req.get('Authorization');
        const messageSuccess = {message: 'Success!'};

        if (!headerValue) {
            return res.send(messageSuccess);
        }

        const [, token] = headerValue.split(' ');

        if (!token) {
            return res.send(messageSuccess);
        }

        const user = await User.findOne({token});

        if (!user) {
            return res.send(messageSuccess);
        }

        user.generateToken();
        await user.save();
        return res.send(messageSuccess);
    } catch (err) {
        return next(err);
    }
});


export default usersRouter;