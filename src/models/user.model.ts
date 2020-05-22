import * as mongoose from 'mongoose';
import {InterfaceModelProxy} from "./proxy.model";

export interface InterfaceModelUser extends mongoose.Document {
    username: string,
    password: string
    gender: number,
    post_type: any[],
    proxy: InterfaceModelProxy,
    created_at: Date
    updated_at: Date
}

const userSchema = new mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        gender: {type: Number, required: false},
        post_type: {type: Array, required: true},
        proxy: {type: Object, required: true},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date},
    });

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const userModel = mongoose.model<InterfaceModelUser & mongoose.Document>('User', userSchema);

export default userModel;