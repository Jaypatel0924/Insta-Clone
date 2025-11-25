import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        default: null
    },
    video: {
        type: String,
        default: null
    },
    text: {
        type: String,
        default: ''
    },
    views: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        index: { expireAfterSeconds: 0 }
    }
}, { timestamps: true });

// Custom validation to ensure either image or video exists
storySchema.pre('save', function(next) {
    if (!this.image && !this.video) {
        throw new Error('Story must have either an image or a video');
    }
    next();
});

export const Story = mongoose.model('Story', storySchema);
