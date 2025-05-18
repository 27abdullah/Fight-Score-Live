const mongoose = require("mongoose");
const {
    FIGHTER_NAME_MAX_LENGTH,
    SPORTS,
    MAX_TOTAL_ROUNDS,
    WINNERS,
    FIGHT_OUTCOMES,
} = require("../utils");

const fightSchema = new mongoose.Schema(
    {
        fighterA: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: FIGHTER_NAME_MAX_LENGTH,
        },
        fighterB: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: FIGHTER_NAME_MAX_LENGTH,
        },
        sport: {
            type: String,
            required: true,
            enum: SPORTS,
        },
        totalRounds: {
            type: Number,
            required: true,
            min: 1,
            max: MAX_TOTAL_ROUNDS,
        },
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
                enum: FIGHT_OUTCOMES,
            },
            winner: {
                type: String,
                required: false,
                enum: WINNERS,
            },
            _id: false,
        },
    },
    { timestamps: true }
);

module.exports = fightSchema;
