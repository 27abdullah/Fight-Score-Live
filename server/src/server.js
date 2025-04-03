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
    endCard,
} = require("./routes/moderator");
const { setupUserRoutes, displayLiveFights } = require("./routes/user");
const { gameController } = require("./state/gameController");

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
app.post("/api/card", createCard);
app.post("/api/round", incRound);
app.post("/api/finish", finish);
app.post("/api/next", nextFight);
app.post("/api/update", update);
app.post("/api/end-card", endCard);
app.get("/api/log/controller", logController);
app.get("/api/test", test);

// User routers
app.get("/api/live-fights", displayLiveFights);

const startServer = async () => {
    await redisClient.connect();
    await connectDatabase();
    await gameController.loadFromMongo();

    server.listen(4000, () => {
        console.log("Server listening on port 4000");
    });
};

startServer();
