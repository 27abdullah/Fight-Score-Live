const { Server } = require("socket.io");
const { redisClient } = require("./redis");
const jwt = require("jsonwebtoken");
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const isValidUserId = async (req) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, SUPABASE_JWT_SECRET);
    } catch (err) {
        return false;
    }

    const uid = payload.sub;
    const roomId = req.headers["roomid"];
    if (!uid || !roomId) return false;

    const roomExists = await redisClient.exists(roomId);
    if (!roomExists) return false;

    return true;
};

const configureSocket = (server, gameController) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
        allowRequest: async (req, callback) => {
            if (await isValidUserId(req)) {
                callback(null, true);
            } else {
                callback("Unauthorised", false);
            }
        },
    });

    io.on("connection", async (socket) => {
        let userId;
        let roomId;
        try {
            const token =
                socket.handshake.headers["authorization"]?.split(" ")[1];
            const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
            userId = payload.sub;
            roomId = socket.handshake.headers["roomid"];

            socket.join(roomId);
        } catch (err) {
            socket.disconnect(true);
        }

        if (!userId || !roomId) {
            socket.disconnect(true);
            return;
        }

        socket.data.userId = userId;
        socket.data.roomId = roomId;

        socket.on("roundResults", async (id, data) => {
            scores = [10, 9, 8, 7];
            if (
                !id ||
                !data ||
                !scores.includes(data.scoreA) ||
                !scores.includes(data.scoreB)
            )
                return;

            const cardState = await gameController.getCard(id);
            if (cardState == null) return;

            cardState.roundResults(
                data.scoreA,
                data.scoreB,
                data.round,
                socket.data.userId
            );
        });

        socket.on("pullStats", async (round, id, callback) => {
            if (!id || !round) return;

            const cardState = await gameController.getCard(id);
            if (cardState == null) return;
            if (round > cardState.currentRound - 1 || round < 0) return;

            callback({
                votesA: await redisClient.get(
                    `${cardState.id}/${round}/votesA`
                ),
                votesB: await redisClient.get(
                    `${cardState.id}/${round}/votesB`
                ),
                medianDiff: await redisClient.get(
                    `${cardState.id}/${round}/median`
                ),
            });
        });

        socket.on("ready", async (id, callback) => {
            if (!id) return;
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
