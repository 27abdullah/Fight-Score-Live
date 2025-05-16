const cors = require("cors");

const corsOptions = {
    // TODO fix this
    origin: ["http://localhost:5173"],
};

module.exports = cors(corsOptions);
