import { FollowRequest } from "../models/followRequest.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendFollowRequest = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        if (senderId === receiverId) {
            return res.status(400).json({
                message: 'Cannot send request to yourself',
                success: false
            });
        }

        const receiverUser = await User.findById(receiverId);
        if (!receiverUser) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Check if already following
        const currentUser = await User.findById(senderId);
        if (currentUser.following.includes(receiverId)) {
            return res.status(400).json({
                message: 'Already following this user',
                success: false
            });
        }

        // Check if request already exists
        const existingRequest = await FollowRequest.findOne({
            sender: senderId,
            receiver: receiverId
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'Follow request already sent',
                success: false
            });
        }

        let followRequest;
        
        // If receiver is not private, auto-accept
        if (!receiverUser.isPrivate) {
            await Promise.all([
                User.updateOne({ _id: senderId }, { $push: { following: receiverId } }),
                User.updateOne({ _id: receiverId }, { $push: { followers: senderId } })
            ]);

            followRequest = await FollowRequest.create({
                sender: senderId,
                receiver: receiverId,
                status: 'accepted'
            });

            // Emit notification
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('notification', {
                    type: 'follow',
                    senderId,
                    message: 'Someone followed you'
                });
            }
        } else {
            // Create pending request for private accounts
            followRequest = await FollowRequest.create({
                sender: senderId,
                receiver: receiverId,
                status: 'pending'
            });

            // Add to user's follow requests
            receiverUser.followRequests.push(followRequest._id);
            await receiverUser.save();

            // Emit notification
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('notification', {
                    type: 'follow_request',
                    senderId,
                    requestId: followRequest._id,
                    message: 'Someone sent you a follow request'
                });
            }

            // Create notification in DB
            await Notification.create({
                recipient: receiverId,
                sender: senderId,
                type: 'follow_request'
            });
        }

        return res.status(201).json({
            message: !receiverUser.isPrivate ? 'Followed successfully' : 'Follow request sent',
            followRequest,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error sending follow request',
            success: false
        });
    }
};

export const getFollowRequests = async (req, res) => {
    try {
        const userId = req.id;
        const requests = await FollowRequest.find({
            receiver: userId,
            status: 'pending'
        }).populate('sender', 'username profilePicture bio');

        return res.status(200).json({
            requests,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching follow requests',
            success: false
        });
    }
};

export const acceptFollowRequest = async (req, res) => {
    try {
        const userId = req.id;
        const requestId = req.params.id;

        const followRequest = await FollowRequest.findById(requestId);
        if (!followRequest) {
            return res.status(404).json({
                message: 'Follow request not found',
                success: false
            });
        }

        if (followRequest.receiver.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        // Update follow request status
        followRequest.status = 'accepted';
        await followRequest.save();

        // Add to followers/following
        await Promise.all([
            User.updateOne({ _id: followRequest.sender }, { $push: { following: userId } }),
            User.updateOne({ _id: userId }, { $push: { followers: followRequest.sender } })
        ]);

        // Remove from pending requests
        await User.updateOne({ _id: userId }, { $pull: { followRequests: requestId } });

        // Emit notification to requester
        const requesterSocketId = getReceiverSocketId(followRequest.sender.toString());
        if (requesterSocketId) {
            io.to(requesterSocketId).emit('notification', {
                type: 'follow',
                receiverId: userId,
                message: 'Your follow request was accepted'
            });
        }

        return res.status(200).json({
            message: 'Follow request accepted',
            followRequest,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error accepting follow request',
            success: false
        });
    }
};

export const rejectFollowRequest = async (req, res) => {
    try {
        const userId = req.id;
        const requestId = req.params.id;

        const followRequest = await FollowRequest.findById(requestId);
        if (!followRequest) {
            return res.status(404).json({
                message: 'Follow request not found',
                success: false
            });
        }

        if (followRequest.receiver.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        // Update status
        followRequest.status = 'rejected';
        await followRequest.save();

        // Remove from pending requests
        await User.updateOne({ _id: userId }, { $pull: { followRequests: requestId } });

        return res.status(200).json({
            message: 'Follow request rejected',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error rejecting follow request',
            success: false
        });
    }
};

export const cancelFollowRequest = async (req, res) => {
    try {
        const userId = req.id;
        const receiverId = req.params.id;

        const followRequest = await FollowRequest.findOne({
            sender: userId,
            receiver: receiverId,
            status: 'pending'
        });

        if (!followRequest) {
            return res.status(404).json({
                message: 'Follow request not found',
                success: false
            });
        }

        await FollowRequest.deleteOne({ _id: followRequest._id });
        await User.updateOne({ _id: receiverId }, { $pull: { followRequests: followRequest._id } });

        return res.status(200).json({
            message: 'Follow request cancelled',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error cancelling follow request',
            success: false
        });
    }
};
