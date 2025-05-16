const express = require("express");
const http = require("http");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const cors = require("./config/cors");
const helmet = require("helmet");
const { json } = require("body-parser");
const cron = require("node-cron");
const { connectDatabase, endOldCards } = require("./config/mongodb");
const { redisClient } = require("./config/redis");
const configureSocket = require("./config/socket");
const { setupUserRoutes, displayLiveFights } = require("./routes/user");
const { gameController } = require("./state/gameController");
const {
    createRoomValidation,
    bodyIdValidation,
    finishValidation,
    setWinnerValidation,
    hostMessageValidation,
    paramIdValidation,
} = require("./routes/validation");
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

const app = express();
const server = http.createServer(app);
const io = configureSocket(server, gameController);
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
    message: "Too many requests, please try again later.",
});

gameController.setRedis(redisClient);
setupModRoutes(gameController, io);
setupUserRoutes(gameController);

app.use(limiter);
app.use(helmet());
app.use(cors);
app.use(express.json()); // parse json req body
app.use(json({ limit: "30kb" }));

// Moderator routes
app.post(
    "/api/create-room",
    createRoomValidation,
    verifySupabaseToken,
    createCard
);

app.post(
    "/api/round",
    bodyIdValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    incRound
);
app.post(
    "/api/finish",
    finishValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    finish
);
app.post(
    "/api/set-winner",
    setWinnerValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    setWinner
);
app.post(
    "/api/next",
    bodyIdValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    nextFight
);
app.post(
    "/api/update",
    bodyIdValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    update
);
app.post(
    "/api/end-card",
    bodyIdValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    endCard
);
app.post(
    "/api/host-message",
    hostMessageValidation,
    verifySupabaseToken,
    verifyTokenMatchBody,
    hostMessage
);
app.get(
    "/api/fetch-room/:id",
    paramIdValidation,
    verifySupabaseToken,
    verifyTokenMatchParams,
    fetchRoom
);
app.get(
    "/api/user-count/:id",
    paramIdValidation,
    verifySupabaseToken,
    verifyTokenMatchParams,
    getLiveUserCount
);

// Testing routes
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
