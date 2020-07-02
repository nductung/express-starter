import * as mongoose from 'mongoose';
import InterfaceModelUser from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, unique: true, required: true},
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        role: {type: String, default: 'user'},
        session: {type: Number, default: 0},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    }, {
        toJSON: {
            virtuals: true,
            getters: true
        }
    });

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const userModel = mongoose.model<InterfaceModelUser & mongoose.Document>('User', userSchema);

export default userModel;
