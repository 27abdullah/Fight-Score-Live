const mongoose = require("mongoose");

const fslSchema = new mongoose.Schema(
    {
        fighterA: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("fslSchema", fslSchema);
