const mongoose = require("mongoose");

const fightSchema = new mongoose.Schema(
    {
        fighterA: { type: String, required: true },
        fighterB: { type: String, required: true },
        sport: { type: String, required: true },
        totalRounds: { type: Number, required: true },
        stats: {
            medians: {
                type: [Number],
                default: [],
            },
            votesA: {
                type: [Number],
                default: [],
            },
            votesB: {
                type: [Number],
                default: [],
            },
            diffs: {
                type: [[Number]],
                default: [],
            },
            _id: false,
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
            _id: false,
        },
    },
    { timestamps: true }
);

module.exports = fightSchema;
