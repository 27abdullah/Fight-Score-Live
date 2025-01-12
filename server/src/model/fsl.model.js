const mongoose = require("mongoose");

const fslSchema = new mongoose.Schema(
    {
        fighterA: { type: String, required: true },
        fighterB: { type: String, required: true },
        id: { type: String, required: true },
        outcome: { type: String, required: true },
        sport: { type: String, required: true },
        totalRounds: { type: Number, required: true },
        stats: {
            statsA: {
                type: [Number],
                required: true,
            },
            statsB: {
                type: [Number],
                required: true,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("fslSchema", fslSchema);
