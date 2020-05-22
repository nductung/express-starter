import * as mongoose from 'mongoose';
import {InterfaceModelUser} from "./user.model";

export interface InterfaceModelJob extends mongoose.Document {
    user: InterfaceModelUser,
    status: number,
    jobs: any[],
    start_date: Date,
    created_at: Date,
    updated_at: Date
}

const jobSchema = new mongoose.Schema(
    {
        user: {type: Object, required: true},
        status: {type: Number, required: true},
        jobs: {type: Array, required: true},
        start_date: {type: Date},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date},
    });

jobSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const jobModel = mongoose.model<InterfaceModelJob & mongoose.Document>('Job', jobSchema);

export default jobModel;