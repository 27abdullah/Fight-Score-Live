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
    cleanUp,
} = require("./routes/moderator");
const { setupUserRoutes, displayLiveFights } = require("./routes/user");
const { gameController } = require("./state/GameController");

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, gameController);

gameController.setRedis(redisClient);
setupModRoutes(gameController, io);
setupUserRoutes(gameController);

// TODO - make the id in the url not in the body
app.use(cors);
app.use(express.json()); // parse json req body

// Moderator routers
app.post("/api/update", update);
app.post("/api/round", incRound);
app.get("/api/test", test);
app.post("/api/finish", finish);
app.post("/api/next", nextFight);
app.post("/api/clean-up", cleanUp);
app.post("/api/card", createCard);
app.get("/api/log/controller", logController);

// User routers
app.get("/api/live-fights", displayLiveFights);

const startServer = async () => {
    await redisClient.connect();
    await connectDatabase();
    await gameController.loadFromRedis();

    server.listen(4000, () => {
        console.log("Server listening on port 4000");
    });
};

startServer();
