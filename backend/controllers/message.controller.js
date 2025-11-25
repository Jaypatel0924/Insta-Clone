import {Conversation} from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import {Message} from "../models/message.model.js"
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// for chatting
export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage:message, mediaType, emoji} = req.body;
        const mediaFile = req.file;
      
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        // establish the conversation if not started yet.
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };

        let mediaUrl = '';
        
        // Handle media upload
        if(mediaFile && mediaType) {
            if(['image', 'video', 'reel'].includes(mediaType)) {
                const fileUri = getDataUri(mediaFile);
                const cloudResponse = await cloudinary.uploader.upload(fileUri, {
                    resource_type: mediaType === 'image' ? 'image' : 'video',
                    max_bytes: mediaType === 'reel' ? 209715200 : 104857600 // 200MB for reel, 100MB for others
                });
                mediaUrl = cloudResponse.secure_url;
            }
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message || '',
            mediaType: mediaType || 'text',
            mediaUrl,
            emoji: emoji || '',
            isRead: false
        });
        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(),newMessage.save()])

        // implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error sending message',
            success: false
        });
    }
}

export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        // Mark messages as read
        await Message.updateMany(
            { 
                senderId: receiverId,
                receiverId: senderId,
                isRead: false
            },
            { isRead: true }
        );

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching messages',
            success: false
        });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const userId = req.id;
        const messageId = req.params.id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                message: 'Message not found',
                success: false
            });
        }

        // Only sender can delete
        if (message.senderId.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        message.deletedFor.push(userId);
        await message.save();

        return res.status(200).json({
            message: 'Message deleted',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting message',
            success: false
        });
    }
}

export const markMessagesAsRead = async (req, res) => {
    try {
        const userId = req.id;
        const { conversationId } = req.body;

        await Message.updateMany(
            {
                receiverId: userId,
                isRead: false
            },
            { isRead: true }
        );

        return res.status(200).json({
            message: 'Messages marked as read',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error marking messages as read',
            success: false
        });
    }
};