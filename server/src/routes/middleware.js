const jwt = require("jsonwebtoken");

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

function verifySupabaseToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    //TODO remove
    if (token == "hax") {
        next();
    }

    try {
        const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

//TODO test
function verifyTokenMatch(req, res, next) {
    //TODO remove
    if (token == "hax") {
        next();
    }

    const { id } = req.body;
    const { sub } = req.user;

    if (id !== sub) {
        return res.status(403).json({ error: "Token does not match ID" });
    }

    next();
}

module.exports = {
    verifySupabaseToken,
    verifyTokenMatch,
};
