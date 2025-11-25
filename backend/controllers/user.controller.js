import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
            bookmarks: user.bookmarks || []
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            .populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
            .populate({ path: 'reels', options: { sort: { createdAt: -1 } } })
            .populate({ path: 'bookmarks', options: { sort: { createdAt: -1 } } })
            .select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        
        // Get tagged posts (posts where this user is tagged)
        const taggedPosts = await Post.find({ 
            taggedUsers: userId 
        }).sort({ createdAt: -1 });
        
        user = user.toObject();
        user.taggedInPosts = taggedPosts;
        
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching profile',
            success: false
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // current user
        const jiskoFollowKrunga = req.params.id; // target user
        
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        
        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ]);
            
            // Get updated user data
            const updatedUser = await User.findById(followKrneWala).select('-password');
            
            return res.status(200).json({ 
                message: 'Unfollowed successfully', 
                success: true,
                user: updatedUser,
                action: 'unfollow'
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ]);
            
            // Get updated user data
            const updatedUser = await User.findById(followKrneWala).select('-password');
            
            return res.status(200).json({ 
                message: 'Followed successfully', 
                success: true,
                user: updatedUser,
                action: 'follow'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

export const togglePrivateAccount = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        user.isPrivate = !user.isPrivate;
        await user.save();

        return res.status(200).json({
            message: user.isPrivate ? 'Account is now private' : 'Account is now public',
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error toggling account privacy',
            success: false
        });
    }
}

export const blockUser = async (req, res) => {
    try {
        const userId = req.id;
        const blockUserId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        if (user.blockedUsers.includes(blockUserId)) {
            // Unblock
            user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== blockUserId);
            await user.save();
            return res.status(200).json({
                message: 'User unblocked',
                user,
                success: true
            });
        } else {
            // Block
            user.blockedUsers.push(blockUserId);
            // Also remove from following/followers
            user.following = user.following.filter(id => id.toString() !== blockUserId);
            user.followers = user.followers.filter(id => id.toString() !== blockUserId);
            await user.save();

            return res.status(200).json({
                message: 'User blocked',
                user,
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error blocking user',
            success: false
        });
    }
}

export const addAccountSwitch = async (req, res) => {
    try {
        const userId = req.id;
        const { accountName, accountType } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        user.accountSwitches.push({
            accountName,
            accountType
        });
        await user.save();

        return res.status(201).json({
            message: 'Account added',
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error adding account',
            success: false
        });
    }
}

export const getAccountSwitches = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            accountSwitches: user.accountSwitches,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching accounts',
            success: false
        });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.status(400).json({
                message: 'Search query is required',
                success: false
            });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password').limit(10);

        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error searching users',
            success: false
        });
    }
}

export const getFollowingUsers = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId)
            .populate({ path: 'following', select: '-password' });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            following: user.following,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching following list',
            success: false
        });
    }
}