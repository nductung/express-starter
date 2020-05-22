import * as mongoose from 'mongoose';

export interface InterfaceModelProxy extends mongoose.Document {
    address: string,
    port: number,
    status: number,
    used: number,
    ip: string,
    country: string,
    created_at: Date,
    updated_at: Date
}

const proxySchema = new mongoose.Schema(
    {
        address: {type: String, unique: true, required: true},
        port: {type: Number, required: true},
        status: {type: Number, required: true},
        used: {type: Number, required: true},
        ip: {type: String, required: true},
        country: {type: String, required: false},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date},
    });

proxySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const proxyModel = mongoose.model<InterfaceModelProxy & mongoose.Document>('Proxy', proxySchema);

export default proxyModel;