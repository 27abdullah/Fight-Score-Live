const mongoose = require("mongoose");
const fightSchema = require("../model/fight.model");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // process.exit(1);
    }
};

module.exports = { connectDatabase };
