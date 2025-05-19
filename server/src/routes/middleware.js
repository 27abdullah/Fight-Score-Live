const jwt = require("jsonwebtoken");
const { gameController } = require("../state/gameController");
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const { logger } = require("../config/logger");

function getTokenFromHeaders(req) {
    const authHeader = req.headers.authorization;
    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ") ||
        authHeader.split(" ").length !== 2
    ) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }
    return authHeader.split(" ")[1];
}

function verifySupabaseToken(req, res, next) {
    const token = getTokenFromHeaders(req);
    try {
        const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

function verifyTokenMatchBody(req, res, next) {
    const { id } = req.body;
    const { sub } = req.user;
    const owner = gameController.cards.get(id)?.owner;
    if (owner !== sub) {
        return res.status(403).json({ error: "Token does not match ID" });
    }

    next();
}

function verifyTokenMatchParams(req, res, next) {
    const id = req.params?.id;
    const { sub } = req.user;
    const owner = gameController.cards.get(id)?.owner;

    if (owner !== sub) {
        return res.status(403).json({ error: "Token does not match ID" });
    }

    next();
}

function errorHandler(err, req, res, next) {
    logger.fatal({
        url: req.url,
        client: req.headers?.authorization,
        stack: err.stack,
        error: err.message,
    });
    res.status(500).json({ error: "Internal server error" });
}

module.exports = {
    verifySupabaseToken,
    verifyTokenMatchBody,
    verifyTokenMatchParams,
    errorHandler,
};
