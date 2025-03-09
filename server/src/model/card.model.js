const mongoose = require("mongoose");
const fightSchema = require("./fight.model");

const cardSchema = new mongoose.Schema(
    {
        owner: { type: String, required: true },
        name: { type: String, required: true },
        fights: [fightSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("cardSchema", cardSchema);
