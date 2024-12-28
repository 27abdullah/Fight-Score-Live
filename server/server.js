const GameState = require("./GameState");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const redis = require("redis");

const wait = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

// Redis client
const client = redis.createClient({
    host: "localhost", // Default Redis server
    port: 6379, // Default Redis port
});

// Handle Redis connection events
client.on("connect", () => {
    console.log("Connected to Redis");
});

client.on("error", (err) => {
    console.error("Redis error:", err);
});

async function startServer() {
    await client.connect();

    // Your app logic goes here (like setting up routes, etc.)
}

startServer();
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.static("public"));

const gameState = new GameState(5, "mma");

app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana"] });
});

// app.listen(8080, () => {
//     console.log("Server started on 8080");
// });

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
            client.incr(`${gameState.id}/${data.round}/A`);
        } else if (data.scoreA < data.scoreB) {
            client.incr(`${gameState.id}/${data.round}/B`);
        } else {
            client.incr(`${gameState.id}/${data.round}/A`);
            client.incr(`${gameState.id}/${data.round}/B`);
        }
    });

    socket.on("pullStats", async (round, callback) => {
        callback({
            statsA: await client.get(`${gameState.id}/${round}/A`),
            statsB: await client.get(`${gameState.id}/${round}/B`),
        });
    });

    socket.on("ready", () => {
        socket.emit("init", {
            totalRounds: gameState.totalRounds,
            sport: gameState.sport,
            currRound: gameState.currentRound,
        });
    });
});

app.get("/api/round", async (req, res) => {
    gameState.incRound();
    result = io.emit("incRound");
    await wait(2);
    console.log(`${gameState.id}/${gameState.currentRound - 1}`);
    stats = {
        statsA: await client.get(
            `${gameState.id}/${gameState.currentRound - 1}/A`
        ),
        statsB: await client.get(
            `${gameState.id}/${gameState.currentRound - 1}/B`
        ),
        round: gameState.currentRound - 1,
    };
    io.emit(`stats/${gameState.currentRound - 1}`, stats);
    res.json({ result, stats });
});

server.listen(4000, () => {
    console.log("listening on *:4000");
});
