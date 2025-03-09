const express = require("express");
const http = require("http");
require("dotenv").config();

const { connectDatabase } = require("./config/mongodb");
const { redisClient } = require("./config/redis");
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
    finish,
} = require("./routes/moderator");
const { gameController } = require("./state/GameController");

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, gameController);

gameController.setRedis(redisClient);
setupModRoutes(gameController, io);

// TODO - make the id in the url not in the body
app.use(cors);
app.use(express.json()); // parse json req body
app.post("/api/update", update);
app.post("/api/round", incRound);
app.get("/api/test", test);
app.post("/api/finish", finish);
app.post("/api/next", nextFight);
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
