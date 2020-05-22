import * as mongoose from 'mongoose';

export interface InterfaceModelPost extends mongoose.Document {
    image: string,
    caption: string,
    post_id: string,
    gender: number,
    status: number,
    hashtags: any[],
    categories: any[],
    created_at: Date,
    updated_at: Date
}

const postSchema = new mongoose.Schema(
    {
        image: {type: String, required: false},
        caption: {type: String, required: true},
        post_id: {type: String, unique: true, required: false},
        gender: {type: Number, required: false},
        status: {type: Number, required: true},
        hashtags: {type: Array, required: false},
        categories: {type: Array, required: false},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date},
    });

postSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const postModel = mongoose.model<InterfaceModelPost & mongoose.Document>('Post', postSchema);

export default postModel;