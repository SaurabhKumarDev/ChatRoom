const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { createAdapter } = require("@socket.io/redis-adapter");
const redis = require("redis");
require("dotenv").config();

const { createClient } = redis;
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Redis URL and credentials
const redisURL = "redis://127.0.0.1:6379";
const redisOptions = process.env.RedisPassword
    ? {
        password: process.env.RedisPassword, socket: {
            host: process.env.RedisHost,
            port: process.env.RedisPort
        }
    }
    : { url: redisURL };

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatRoom Bot";

// Redis adapter setup
(async () => {
    try {
        pubClient = createClient(redisOptions);
        await pubClient.connect();

        subClient = pubClient.duplicate();

        io.adapter(createAdapter(pubClient, subClient));
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1);
    }
})();

// Run when client connects
io.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to ChatApp!"));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", formatMessage(user.username, msg));
        }
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));