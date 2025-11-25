import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    music: {
        type: String,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReelComment'
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

export const Reel = mongoose.model('Reel', reelSchema);
