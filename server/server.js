const GameState = require("./GameState");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const redis = require("redis");

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
        if (data.scoreA > data.scoreB) {
            client.incr(`${gameState.id}/${data.round - 1}/A`);
        } else if (data.scoreA < data.scoreB) {
            client.incr(`${gameState.id}/${data.round - 1}/B`);
        } else {
            client.incr(`${gameState.id}/${data.round - 1}/A`);
            client.incr(`${gameState.id}/${data.round - 1}/B`);
        }
    });

    socket.on("ready", () => {
        socket.emit("init", {
            totalRounds: gameState.totalRounds,
            sport: gameState.sport,
            currRound: gameState.currentRound,
        });
    });
});

app.get("/api/round", (req, res) => {
    gameState.incRound();
    result = io.emit("incRound");
    //Wait
    //emit aggregates
    res.json({ result });
});

server.listen(4000, () => {
    console.log("listening on *:4000");
});
