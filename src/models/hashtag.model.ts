import * as mongoose from 'mongoose';

export interface InterfaceModelHashtag extends mongoose.Document {
    name: string,
    created_at: Date,
    updated_at: Date
}

const hashtagSchema = new mongoose.Schema(
    {
        name: {type: String, unique: true, required: true},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date},
    });

hashtagSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const hashtagModel = mongoose.model<InterfaceModelHashtag & mongoose.Document>('Hashtag', hashtagSchema);

export default hashtagModel;