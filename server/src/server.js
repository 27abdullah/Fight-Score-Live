const express = require("express");
const http = require("http");
require("dotenv").config();

const cron = require("node-cron");
const { connectDatabase, endOldCards } = require("./config/mongodb");
const { redisClient } = require("./config/redis");
const configureSocket = require("./config/socket");
const cors = require("./config/cors");
const {
    verifySupabaseToken,
    verifyTokenMatchBody,
    verifyTokenMatchParams,
} = require("./routes/middleware");
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
    setWinner,
    fetchRoom,
    getLiveUserCount,
    hostMessage,
} = require("./routes/moderator");
const { setupUserRoutes, displayLiveFights } = require("./routes/user");
const { gameController } = require("./state/gameController");

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, gameController);

gameController.setRedis(redisClient);
setupModRoutes(gameController, io);
setupUserRoutes(gameController);

// TODO - make the id in the url not in the body?
app.use(cors);
app.use(express.json()); // parse json req body

// Moderator routes
app.post("/api/create-room", verifySupabaseToken, createCard);

app.post("/api/round", verifySupabaseToken, verifyTokenMatchBody, incRound);
app.post("/api/finish", verifySupabaseToken, verifyTokenMatchBody, finish);
app.post(
    "/api/set-winner",
    verifySupabaseToken,
    verifyTokenMatchBody,
    setWinner
);
app.post("/api/next", verifySupabaseToken, verifyTokenMatchBody, nextFight);
app.post("/api/update", verifySupabaseToken, verifyTokenMatchBody, update);
app.post("/api/end-card", verifySupabaseToken, verifyTokenMatchBody, endCard);
app.post(
    "/api/host-message",
    verifySupabaseToken,
    verifyTokenMatchBody,
    hostMessage
);
app.get(
    "/api/fetch-room/:id",
    verifySupabaseToken,
    verifyTokenMatchParams,
    fetchRoom
);
app.get(
    "/api/user-count/:id",
    verifySupabaseToken,
    verifyTokenMatchParams,
    getLiveUserCount
);

app.get("/api/log/controller", logController);
app.get("/api/test", test);

// User routes
app.get("/api/live-fights", displayLiveFights);

const startServer = async () => {
    await redisClient.connect();
    await connectDatabase();
    await gameController.loadFromMongo();

    server.listen(4000, () => {
        console.log("Server listening on port 4000");
    });

    cron.schedule("0 0 * * *", async () => {
        console.log("Running cron job to end old cards");
        await endOldCards(gameController);
    });
};

startServer();

// Cron jobs
