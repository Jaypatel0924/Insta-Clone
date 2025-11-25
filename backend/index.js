// import express, { urlencoded } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import postRoute from "./routes/post.route.js";
// import messageRoute from "./routes/message.route.js";
// import { app, server } from "./socket/socket.js";
// import path from "path";
 
// dotenv.config();


// const PORT = process.env.PORT || 3000;

// const __dirname = path.resolve();

// //middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(urlencoded({ extended: true }));
// const corsOptions = {
//     origin: process.env.URL,
//     credentials: true
// }
// app.use(cors(corsOptions));

// // yha pr apni api ayengi
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/post", postRoute);
// app.use("/api/v1/message", messageRoute);


// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req,res)=>{
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// })


// server.listen(PORT, () => {
//     connectDB();
//     console.log(`Server listen at port ${PORT}`);
// });

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import searchRoute from "./routes/search.route.js";
import storyRoute from "./routes/story.route.js";
import reelRoute from "./routes/reel.route.js";
import followRequestRoute from "./routes/followRequest.route.js";
import notificationRoute from "./routes/notification.route.js";
import exploreRoute from "./routes/explore.route.js";

// socket.io setup
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// ----------------------------
// FIXED CORS CONFIGURATION
// ----------------------------
app.use(cors({
    origin: "http://localhost:5173",     // Vite frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/story", storyRoute);
app.use("/api/v1/reel", reelRoute);
app.use("/api/v1/follow-request", followRequestRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/explore", exploreRoute);

// -----------------------
// SERVE FRONTEND BUILD
// -----------------------
const frontendDistPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendDistPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Start Server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server running at http://localhost:${PORT}`);
});
