import {randomUUID} from "crypto";
import {Schema, model, HydratedDocument} from 'mongoose';
import bcrypt from 'bcrypt';
import {UserMethods, UserModel, UserTypes} from "../types";

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<UserTypes, UserModel, UserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function(this: HydratedDocument<UserTypes>, value: string): Promise<Boolean> {
                if (!this.isModified('email')) return true;

                const user: HydratedDocument<UserTypes> | null = await User.findOne({email: value});
                return !user;
            },
            message: "This user is already registered!",
        }
    },
    displayName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    googleID: String,
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

UserSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

UserSchema.pre('save',async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    },
});

const User = model<UserTypes, UserModel>('User', UserSchema);

export default User;