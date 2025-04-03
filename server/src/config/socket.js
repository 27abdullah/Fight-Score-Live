const { Server } = require("socket.io");
const { redisClient } = require("./redis");

const configureSocket = (server, gameController) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
    });

    io.on("connection", async (socket) => {
        console.log(`a user connected ${socket.id}`);

        socket.on("register", (id) => {
            socket.join(id);
        });

        socket.on("roundResults", async (id, data) => {
            console.log(
                `${socket.id}: A=${data.scoreA} B=${data.scoreB}, r=${data.round}`
            );
            const cardState = await gameController.getCard(id);
            if (cardState == null) return;

            if (data.round != cardState.currentRound - 1) {
                console.log(
                    "roundResults mismatch: ",
                    data.round,
                    cardState.currentRound
                );
                return;
            }

            cardState.roundResults(data.scoreA, data.scoreB);
        });

        socket.on("pullStats", async (round, id, callback) => {
            const cardState = await gameController.getCard(id);
            if (cardState == null) return;
            if (round > cardState.currentRound - 1) return;

            callback({
                statsA: await redisClient.get(`${cardState.id}/${round}/A`),
                statsB: await redisClient.get(`${cardState.id}/${round}/B`),
            });
        });

        socket.on("ready", async (id, callback) => {
            if (!(await gameController.hasId(id))) return;
            const cardState = await gameController.getCard(id);
            if (cardState == null) return;
            const state = cardState.jsonify();
            callback(state);
        });
    });

    return io;
};

module.exports = configureSocket;
