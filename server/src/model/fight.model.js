const mongoose = require("mongoose");

const fightSchema = new mongoose.Schema(
    {
        fighterA: { type: String, required: true },
        fighterB: { type: String, required: true },
        sport: { type: String, required: true },
        totalRounds: { type: Number, required: true },
        stats: {
            statsA: {
                type: [Number],
                required: false,
            },
            statsB: {
                type: [Number],
                required: false,
            },
        },
        outcome: {
            round: {
                type: Number,
                required: false,
            },
            way: {
                type: String,
                required: false,
            },
        },
    },
    { timestamps: true }
);

module.exports = fightSchema;
