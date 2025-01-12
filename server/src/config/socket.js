const { Server } = require("socket.io");
const { redisClient, getRoundStats } = require("./redis");

const configureSocket = (server, gameState) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
    });

    io.on("connection", async (socket) => {
        console.log(`a user connected ${socket.id}`);

        socket.on("roundResults", (data) => {
            console.log(
                `${socket.id}: A=${data.scoreA} B=${data.scoreB}, r=${data.round}`
            );

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
            callback({
                statsA: await redisClient.get(`${gameState.id}/${round}/A`),
                statsB: await redisClient.get(`${gameState.id}/${round}/B`),
            });
        });

        socket.on("ready", () => {
            socket.emit("init", gameState.objectify());
        });
    });

    return io;
};

module.exports = configureSocket;
