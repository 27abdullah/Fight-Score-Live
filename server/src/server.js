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
} = require("./routes/moderator");
const { card } = require("./state/gameController");

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, card);

setupModRoutes(card, io);

app.use(cors);
app.post("/api/update", update);
app.get("/api/round", incRound);
app.get("/api/test", test);
app.get("/api/next", nextFight);
app.post("/api/persist", persist); //TODO REMOVE?

const startServer = async () => {
    await redisClient.connect();
    await connectDatabase();

    server.listen(4000, () => {
        console.log("Server listening on port 4000");
    });
};

startServer();
