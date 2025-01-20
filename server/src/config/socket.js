const { Server } = require("socket.io");
const { redisClient, getRoundStats } = require("./redis");

const configureSocket = (server, card) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
    });

    io.on("connection", async (socket) => {
        console.log(`a user connected ${socket.id}`);

        socket.on("roundResults", (data) => {
            console.log(
                `${socket.id}: A=${data.scoreA} B=${data.scoreB}, r=${data.round}`
            );
            const gameState = card.getCurrentFight();

            if (data.round < gameState.currentRound - 1) {
                console.log(`old data`);
                return;
            }

            if (data.scoreA > data.scoreB) {
                redisClient.incr(`${gameState.id}/${data.round}/A`);
            } else if (data.scoreA < data.scoreB) {
                redisClient.incr(`${gameState.id}/${data.round}/B`);
            } else {
                redisClient.incr(`${gameState.id}/${data.round}/A`);
                redisClient.incr(`${gameState.id}/${data.round}/B`);
            }
        });

        socket.on("pullStats", async (round, callback) => {
            const gameState = card.getCurrentFight();
            callback({
                statsA: await redisClient.get(`${gameState.id}/${round}/A`),
                statsB: await redisClient.get(`${gameState.id}/${round}/B`),
            });
        });

        socket.on("ready", () => {
            const gameState = card.getCurrentFight();
            const state = gameState.objectify();
            state["clear"] = false;
            socket.emit("init", state);
        });
    });

    return io;
};

module.exports = configureSocket;
