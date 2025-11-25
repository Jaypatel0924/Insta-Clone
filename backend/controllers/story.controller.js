import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import sharp from "sharp";

export const createStory = async (req, res) => {
    try {
        const userId = req.id;
        const { text } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: 'Image or video is required for story',
                success: false
            });
        }

        let storyData = {
            author: userId,
            text: text || ''
        };

        // Handle image or video
        if (file.mimetype.startsWith('image/')) {
            // Optimize image
            const optimizedImageBuffer = await sharp(file.buffer)
                .resize({ width: 1080, height: 1920, fit: 'cover' })
                .toFormat('jpeg', { quality: 90 })
                .toBuffer();

            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            storyData.image = cloudResponse.secure_url;
        } else if (file.mimetype.startsWith('video/')) {
            // Upload video to cloudinary
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri, {
                resource_type: 'video',
                max_bytes: 104857600 // 100MB
            });
            storyData.video = cloudResponse.secure_url;
        } else {
            return res.status(400).json({
                message: 'File must be an image or video',
                success: false
            });
        }

        const story = await Story.create(storyData);

        const user = await User.findById(userId);
        if (user) {
            user.stories.push(story._id);
            await user.save();
        }

        await story.populate({ path: 'author', select: 'username profilePicture' });

        // Emit to followers
        if (user && user.followers) {
            user.followers.forEach(followerId => {
                const followerSocketId = getReceiverSocketId(followerId.toString());
                if (followerSocketId) {
                    io.to(followerSocketId).emit('newStory', story);
                }
            });
        }

        return res.status(201).json({
            message: 'Story created successfully',
            story,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating story',
            success: false,
            error: error.message
        });
    }
};

export const getStoriesByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const stories = await Story.find({ author: userId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' });

        return res.status(200).json({
            stories,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching stories',
            success: false
        });
    }
};

export const getAllFollowingStories = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        // Get stories from following AND user's own stories
        const stories = await Story.find({
            author: { $in: [userId, ...user.following] }
        }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' });

        // Group by author
        const groupedStories = {};
        stories.forEach(story => {
            if (!groupedStories[story.author._id]) {
                groupedStories[story.author._id] = {
                    author: story.author,
                    stories: []
                };
            }
            groupedStories[story.author._id].stories.push(story);
        });

        return res.status(200).json({
            storyGroups: Object.values(groupedStories),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching stories',
            success: false
        });
    }
};

export const viewStory = async (req, res) => {
    try {
        const userId = req.id;
        const storyId = req.params.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({
                message: 'Story not found',
                success: false
            });
        }

        // Add view if not already viewed
        if (!story.views.includes(userId)) {
            story.views.push(userId);
            await story.save();

            // Emit notification to story owner
            const storyOwnerSocketId = getReceiverSocketId(story.author.toString());
            if (storyOwnerSocketId) {
                io.to(storyOwnerSocketId).emit('storyViewed', {
                    storyId,
                    userId,
                    viewCount: story.views.length
                });
            }
        }

        return res.status(200).json({
            message: 'Story viewed',
            story,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error viewing story',
            success: false
        });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const userId = req.id;
        const storyId = req.params.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({
                message: 'Story not found',
                success: false
            });
        }

        if (story.author.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        await Story.findByIdAndDelete(storyId);
        await User.findByIdAndUpdate(userId, { $pull: { stories: storyId } });

        return res.status(200).json({
            message: 'Story deleted',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting story',
            success: false
        });
    }
};
