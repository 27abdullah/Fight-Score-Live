const GameState = require("./GameState");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const redis = require("redis");
const fslSchema = require("./model/fsl.model");
const mongoose = require("mongoose");
require("dotenv").config();

const wait = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

// Redis client
const redisClient = redis.createClient({
    host: "localhost", // Default Redis server
    port: 6379, // Default Redis port
});

// Handle Redis connection events
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

async function startServer() {
    await redisClient.connect();
    await mongoose.connect(process.env.MONGO_URI);

    // Your app logic goes here (like setting up routes, etc.)
}

startServer();
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.static("public"));

const gameState = new GameState(5, "mma", "Islam M", "Dustin P");

app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana"] });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

io.on("connection", async (socket) => {
    console.log(`a user connected ${socket.id}`);

    socket.on("roundResults", (data) => {
        console.log(
            `${socket.id}: A=${data.scoreA} B=${data.scoreB}, r=${data.round}`
        );

        if (data.round < gameState.currentRound - 1) {
            console.log(`old data`);
            return;
        }

        if (data.scoreA > data.scoreB) {
            redisClient.incr(`${gameState.id}/${data.round}/A`);
        } else if (data.scoreA < data.scoreB) {
            redisClient.incr(`${gameState.id}/${data.round}/B`);
        } else {
            redisClient.incr(`${gameState.id}/${data.round}/A`);
            redisClient.incr(`${gameState.id}/${data.round}/B`);
        }
    });

    socket.on("pullStats", async (round, callback) => {
        callback({
            statsA: await redisClient.get(`${gameState.id}/${round}/A`),
            statsB: await redisClient.get(`${gameState.id}/${round}/B`),
        });
    });

    socket.on("ready", () => {
        socket.emit("init", gameState.objectify());
    });
});

app.get("/api/round", async (req, res) => {
    if (gameState.currentRound >= gameState.totalRounds + 1) {
        console.log("Fight over");
        res.json({ result: "Fight over" });
        return;
    }

    gameState.incRound();
    result = io.emit("incRound");
    await wait(2);
    console.log(`${gameState.id}/${gameState.currentRound - 1}`);
    stats = {
        statsA: await redisClient.get(
            `${gameState.id}/${gameState.currentRound - 1}/A`
        ),
        statsB: await redisClient.get(
            `${gameState.id}/${gameState.currentRound - 1}/B`
        ),
        round: gameState.currentRound - 1,
    };
    io.emit(`stats/${gameState.currentRound - 1}`, stats);
    res.json({ result, stats });
});
// TEST EXAMPLE
app.get("/api/persist", async (req, res) => {
    try {
        const example = new fslSchema({ fighterA: "test" });
        await example.save();
        res.status(201).json(example);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

server.listen(4000, () => {
    console.log("listening on *:4000");
});
