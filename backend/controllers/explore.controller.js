import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Reel } from "../models/reel.model.js";

export const getExplorePosts = async (req, res) => {
    try {
        const userId = req.id;
        const page = req.query.page || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Get posts from users the current user doesn't follow
        const user = await User.findById(userId);
        const excludeUsers = [userId, ...user.following];

        const posts = await Post.find({
            author: { $nin: excludeUsers }
        })
            .sort({ likes: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profilePicture' }
            });

        const totalPosts = await Post.countDocuments({
            author: { $nin: excludeUsers }
        });

        return res.status(200).json({
            posts,
            totalPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching explore posts',
            success: false
        });
    }
};

export const getExploreReels = async (req, res) => {
    try {
        const userId = req.id;
        const page = req.query.page || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId);
        const excludeUsers = [userId, ...user.following];

        const reels = await Reel.find({
            author: { $nin: excludeUsers }
        })
            .sort({ viewCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username profilePicture');

        const totalReels = await Reel.countDocuments({
            author: { $nin: excludeUsers }
        });

        return res.status(200).json({
            reels,
            totalReels,
            currentPage: page,
            totalPages: Math.ceil(totalReels / limit),
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching explore reels',
            success: false
        });
    }
};

export const getTrendingPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ likes: -1, createdAt: -1 })
            .limit(20)
            .populate('author', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching trending posts',
            success: false
        });
    }
};

export const getTrendingReels = async (req, res) => {
    try {
        const reels = await Reel.find()
            .sort({ viewCount: -1, likes: -1, createdAt: -1 })
            .limit(20)
            .populate('author', 'username profilePicture');

        return res.status(200).json({
            reels,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching trending reels',
            success: false
        });
    }
};

export const getExploreUsers = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        // Get users not followed by current user, excluding self
        const suggestedUsers = await User.find({
            _id: { $ne: userId, $nin: user.following }
        })
            .select('-password')
            .limit(20)
            .sort({ followers: -1 });

        return res.status(200).json({
            users: suggestedUsers,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching suggested users',
            success: false
        });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: 'Search query is required',
                success: false
            });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        })
            .select('-password')
            .limit(20);

        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error searching users',
            success: false
        });
    }
};

export const searchPosts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: 'Search query is required',
                success: false
            });
        }

        const posts = await Post.find({
            caption: { $regex: q, $options: 'i' }
        })
            .populate('author', 'username profilePicture')
            .limit(20);

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error searching posts',
            success: false
        });
    }
};

export const searchHashtags = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: 'Search query is required',
                success: false
            });
        }

        const posts = await Post.find({
            caption: { $regex: `#${q}`, $options: 'i' }
        })
            .populate('author', 'username profilePicture')
            .limit(20);

        return res.status(200).json({
            posts,
            hashtag: q,
            count: posts.length,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error searching hashtags',
            success: false
        });
    }
};
