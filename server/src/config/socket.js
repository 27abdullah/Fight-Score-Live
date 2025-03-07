const { Server } = require("socket.io");
const { redisClient, getRoundStats } = require("./redis");

const configureSocket = (server, gameController) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
    });

    io.on("connection", async (socket) => {
        console.log(`a user connected ${socket.id}`);

        socket.on("register", (id) => {
            socket.join(id);
        });

        socket.on("roundResults", (id, data) => {
            console.log(
                `${socket.id}: A=${data.scoreA} B=${data.scoreB}, r=${data.round}`
            );
            let gameState;
            if (gameController.hasId(id)) {
                gameState = gameController.getCard(id).getCurrentFight();
            } else {
                return;
            }

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

        socket.on("pullStats", async (round, id, callback) => {
            let gameState;
            if (gameController.hasId(id)) {
                gameState = gameController.getCard(id).getCurrentFight();
            } else {
                return;
            }

            callback({
                statsA: await redisClient.get(`${gameState.id}/${round}/A`),
                statsB: await redisClient.get(`${gameState.id}/${round}/B`),
            });
        });

        socket.on("ready", (id, callback) => {
            let gameState;
            if (gameController.hasId(id)) {
                gameState = gameController.getCard(id).getCurrentFight();
            } else {
                return;
            }

            const state = gameState.objectify();
            state["clear"] = false;
            callback(state);
        });
    });

    return io;
};

module.exports = configureSocket;
