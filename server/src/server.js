const express = require("express");
const http = require("http");
require("dotenv").config();

const { connectDatabase, persist } = require("./config/mongodb");
const { redisClient, getRoundStats, clearRounds } = require("./config/redis");
const configureSocket = require("./config/socket");
const cors = require("./config/cors");

const {
    incRound,
    test,
    setupModRoutes,
    nextFight,
    update,
    createCard,
    logController,
} = require("./routes/moderator");
const { gameController } = require("./state/GameController");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, gameController);

setupModRoutes(gameController, io);

app.use(cors);
app.use(express.json()); // parse json req body
app.post("/api/update", update);
app.post("/api/round", incRound);
app.get("/api/test", test);
app.post("/api/next", nextFight);
app.post("/api/persist", persist); //TODO REMOVE?
app.post("/api/card", createCard);
app.get("/api/log/controller", logController);

const startServer = async () => {
    await redisClient.connect();
    await connectDatabase();

    server.listen(4000, () => {
        console.log("Server listening on port 4000");
    });
};

startServer();
