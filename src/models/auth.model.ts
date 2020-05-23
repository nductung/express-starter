import * as mongoose from 'mongoose';

export interface InterfaceModelAuth extends mongoose.Document {
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string
    role: string,
    avatar: {
        url: string
    }
    created_at: Date,
    updated_at: Date,
}

const authSchema = new mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        role: {type: String, required: true},
        avatar: {
            url: String
        },
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date}
    });

authSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.password;
        delete ret.role;
    }
});

const authModel = mongoose.model<InterfaceModelAuth & mongoose.Document>('Auth', authSchema);

export default authModel;
