import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Story events
    socket.on("storyViewed", (data) => {
        const storyOwnerSocketId = getReceiverSocketId(data.authorId);
        if (storyOwnerSocketId) {
            io.to(storyOwnerSocketId).emit("storyViewNotification", data);
        }
    });

    // Reel events
    socket.on("reelLiked", (data) => {
        const reelOwnerSocketId = getReceiverSocketId(data.authorId);
        if (reelOwnerSocketId) {
            io.to(reelOwnerSocketId).emit("reelLikeNotification", data);
        }
    });

    socket.on("reelCommented", (data) => {
        const reelOwnerSocketId = getReceiverSocketId(data.authorId);
        if (reelOwnerSocketId) {
            io.to(reelOwnerSocketId).emit("reelCommentNotification", data);
        }
    });

    // Follow request events
    socket.on("followRequested", (data) => {
        const targetUserSocketId = getReceiverSocketId(data.targetUserId);
        if (targetUserSocketId) {
            io.to(targetUserSocketId).emit("followRequestNotification", data);
        }
    });

    socket.on("followAccepted", (data) => {
        const senderSocketId = getReceiverSocketId(data.senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("followAcceptedNotification", data);
        }
    });

    // Typing indicator for messages
    socket.on("typing", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { userId, username: data.username });
        }
    });

    socket.on("stopTyping", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", { userId });
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };
