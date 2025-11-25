import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    collection: {
        type: String,
        default: 'Saved'
    }
}, { timestamps: true });

export const SavedPost = mongoose.model('SavedPost', savedPostSchema);
