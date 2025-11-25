import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        default: ''
    },
    mediaType: {
        type: String,
        enum: ['text', 'image', 'video', 'reel', 'emoji'],
        default: 'text'
    },
    mediaUrl: {
        type: String,
        default: ''
    },
    emoji: {
        type: String,
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    },
    deletedFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

export const Message = mongoose.model('Message', messageSchema);