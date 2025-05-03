const { Server } = require("socket.io");
const { redisClient } = require("./redis");
const jwt = require("jsonwebtoken");
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const isValidUserId = async (req) => {
    const authHeader = req.headers.authorization;
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

    const roomKey = `active-users/${roomId}`;
    const roomExists = await redisClient.exists(roomKey);
    if (!roomExists) return false;

    const alreadyInRoom = await redisClient.sIsMember(roomKey, uid);
    if (alreadyInRoom) return false;

    await redisClient.sAdd(roomKey, uid);
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

        socket.on("roundResults", async (id, data) => {
            console.log(
                `${socket.id}: A=${data.scoreA} B=${data.scoreB}, r=${data.round}`
            );
            const cardState = await gameController.getCard(id);
            if (cardState == null) return;

            // Stale round results
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
            if (!(await gameController.hasId(id))) return;
            const cardState = await gameController.getCard(id);
            if (cardState == null) return;
            const state = cardState.jsonify();
            callback(state);
        });

        socket.on("disconnect", async (reason) => {
            await redisClient.sRem(`active-users/${roomId}`, userId);
        });
    });

    return io;
};

module.exports = configureSocket;
