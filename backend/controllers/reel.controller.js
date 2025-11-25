import { Reel } from "../models/reel.model.js";
import { ReelComment } from "../models/reelComment.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createReel = async (req, res) => {
    try {
        const userId = req.id;
        const { caption, music } = req.body;
        const video = req.file;

        if (!video) {
            return res.status(400).json({
                message: 'Video is required for reel',
                success: false
            });
        }

        // Upload video to cloudinary
        const fileUri = getDataUri(video);
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            resource_type: 'video',
            max_bytes: 104857600 // 100MB
        });

        const reel = await Reel.create({
            author: userId,
            video: cloudResponse.secure_url,
            caption: caption || '',
            music: music || ''
        });

        const user = await User.findById(userId);
        if (user) {
            user.reels.push(reel._id);
            await user.save();
        }

        await reel.populate({ path: 'author', select: 'username profilePicture' });

        return res.status(201).json({
            message: 'Reel created successfully',
            reel,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error creating reel',
            success: false
        });
    }
};

export const getReels = async (req, res) => {
    try {
        const reels = await Reel.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            reels,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching reels',
            success: false
        });
    }
};

export const getUserReels = async (req, res) => {
    try {
        const userId = req.params.id;
        const reels = await Reel.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' });

        return res.status(200).json({
            reels,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching reels',
            success: false
        });
    }
};

export const likeReel = async (req, res) => {
    try {
        const userId = req.id;
        const reelId = req.params.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: 'Reel not found',
                success: false
            });
        }

        if (reel.likes.includes(userId)) {
            // Unlike
            reel.likes = reel.likes.filter(id => id.toString() !== userId);
        } else {
            // Like
            reel.likes.push(userId);

            // Create notification
            if (reel.author.toString() !== userId) {
                await Notification.create({
                    recipient: reel.author,
                    sender: userId,
                    type: 'like',
                    reel: reelId
                });

                const reelOwnerSocketId = getReceiverSocketId(reel.author.toString());
                if (reelOwnerSocketId) {
                    io.to(reelOwnerSocketId).emit('notification', {
                        type: 'like',
                        userId,
                        reelId,
                        message: 'Someone liked your reel'
                    });
                }
            }
        }

        await reel.save();

        return res.status(200).json({
            message: reel.likes.includes(userId) ? 'Reel liked' : 'Reel unliked',
            reel,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error liking reel',
            success: false
        });
    }
};

export const addReelComment = async (req, res) => {
    try {
        const userId = req.id;
        const reelId = req.params.id;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: 'Comment text is required',
                success: false
            });
        }

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: 'Reel not found',
                success: false
            });
        }

        const comment = await ReelComment.create({
            text,
            author: userId,
            reel: reelId
        });

        await comment.populate({ path: 'author', select: 'username profilePicture' });
        reel.comments.push(comment._id);
        await reel.save();

        // Create notification
        if (reel.author.toString() !== userId) {
            await Notification.create({
                recipient: reel.author,
                sender: userId,
                type: 'comment',
                reel: reelId,
                text: text
            });
        }

        return res.status(201).json({
            message: 'Comment added',
            comment,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error adding comment',
            success: false
        });
    }
};

export const getReelComments = async (req, res) => {
    try {
        const reelId = req.params.id;
        const comments = await ReelComment.find({ reel: reelId })
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' });

        return res.status(200).json({
            comments,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching comments',
            success: false
        });
    }
};

export const deleteReel = async (req, res) => {
    try {
        const userId = req.id;
        const reelId = req.params.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: 'Reel not found',
                success: false
            });
        }

        if (reel.author.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        await Reel.findByIdAndDelete(reelId);
        await User.findByIdAndUpdate(userId, { $pull: { reels: reelId } });
        await ReelComment.deleteMany({ reel: reelId });

        return res.status(200).json({
            message: 'Reel deleted',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting reel',
            success: false
        });
    }
};

export const shareReel = async (req, res) => {
    try {
        const reelId = req.params.id;
        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: 'Reel not found',
                success: false
            });
        }

        reel.shares += 1;
        await reel.save();

        return res.status(200).json({
            message: 'Reel shared',
            reel,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error sharing reel',
            success: false
        });
    }
};

export const incrementReelView = async (req, res) => {
    try {
        const reelId = req.params.id;
        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: 'Reel not found',
                success: false
            });
        }

        reel.viewCount += 1;
        await reel.save();

        return res.status(200).json({
            message: 'View count updated',
            reel,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating view count',
            success: false
        });
    }
};

export const bookmarkReel = async (req, res) => {
    try {
        const reelId = req.params.id;
        const userId = req.id;
        
        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({
                message: 'Reel not found',
                success: false
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        
        // Check if reel is already bookmarked
        if (reel.bookmarks.includes(userId)) {
            // Remove bookmark
            await reel.updateOne({ $pull: { bookmarks: userId } });
            await reel.save();
            return res.status(200).json({
                type: 'unsaved',
                message: 'Reel removed from bookmarks',
                success: true
            });
        } else {
            // Add bookmark
            await reel.updateOne({ $addToSet: { bookmarks: userId } });
            await reel.save();
            return res.status(200).json({
                type: 'saved',
                message: 'Reel bookmarked',
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error bookmarking reel',
            success: false
        });
    }
};
