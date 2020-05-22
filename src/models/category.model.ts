import * as mongoose from 'mongoose';

export interface InterfaceModelCategory extends mongoose.Document {
    name: string,
    created_at: Date,
    updated_at: Date
}

const categorySchema = new mongoose.Schema(
    {
        name: {type: String, unique: true, required: true},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date},
    });

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const categoryModel = mongoose.model<InterfaceModelCategory & mongoose.Document>('Category', categorySchema);

export default categoryModel;