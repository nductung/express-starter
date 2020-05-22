import * as mongoose from 'mongoose';

export interface InterfaceModelComment extends mongoose.Document {
    comments: any[],
    group_id: any[],
    gender: number,
    attitude: string,
    post_id: string,
    status: number,
    hashtags: any[],
    categories: any[],
    created_at: Date,
    updated_at: Date
}

const commentSchema = new mongoose.Schema(
    {
        comments: {type: Array, required: true},
        group_id: {type: Array, required: true},
        gender: {type: Number, required: false},
        attitude: {type: String, required: false},
        post_id: {type: String, unique: true, required: false},
        status: {type: Number, required: true},
        hashtags: {type: Array, required: false},
        categories: {type: Array, required: false},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date}
    });

commentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

const commentModel = mongoose.model<InterfaceModelComment & mongoose.Document>('Comment', commentSchema);

export default commentModel;