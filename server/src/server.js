const express = require("express");
const http = require("http");
require("dotenv").config();

const { connectDatabase, persist } = require("./config/mongodb");
const { redisClient, getRoundStats, clearRounds } = require("./config/redis");
const configureSocket = require("./config/socket");
const cors = require("./config/cors");

const { incRound, test, setupModRoutes } = require("./routes/moderator");
const { gameState } = require("./state/gameController");

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, gameState);

setupModRoutes(gameState, io);

app.use(cors);
app.get("/api/round", incRound);
app.get("/api/persist", persist);
app.get("/api/test", test);

const startServer = async () => {
    await redisClient.connect();
    await connectDatabase();

    server.listen(4000, () => {
        console.log("Server listening on port 4000");
    });
};

startServer();
