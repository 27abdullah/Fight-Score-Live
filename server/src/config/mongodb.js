const mongoose = require("mongoose");
const cardSchema = require("../model/card.model");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // process.exit(1);
    }
};

const endOldCards = async (gameController) => {
    try {
        // Get all active rooms created more than 1 day ago
        const cards = await cardSchema.find({
            createdAt: { $lt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            state: 0,
        });

        cards.forEach((card) => {
            console.log("Ending old card:", card._id.toString());
            gameController.endCard(card._id.toString());
        });
    } catch (err) {
        console.error("Error deleting old cards:", err);
    }
};

module.exports = { connectDatabase, endOldCards };
