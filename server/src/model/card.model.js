const mongoose = require("mongoose");
const fightSchema = require("./fight.model");
const { FIGHT_NAME_MAX_LENGTH, STATES, MAX_FIGHTS } = require("../utils");

const cardSchema = new mongoose.Schema(
    {
        owner: { type: String, required: true },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: FIGHT_NAME_MAX_LENGTH,
        },
        fights: {
            type: [fightSchema],
            validate: function (fights) {
                return fights.length <= MAX_FIGHTS;
            },
        },
        state: { type: Number, required: true, enum: STATES },
    },
    { timestamps: true }
);

module.exports = mongoose.model("cardSchema", cardSchema);
