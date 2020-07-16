import * as mongoose from 'mongoose';
import InterfaceModelUser from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, required: true, default: 'user'},
        picture: {type: String, required: false, default: undefined},
        gender: {type: String, required: false, default: undefined},
        phone: {type: String, required: false, default: undefined},
        confirmed: {type: Boolean, required: true, default: false},
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
