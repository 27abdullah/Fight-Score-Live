const { endOldCards } = require("./mongodb");

const MIDNIGHTLY = "0 0 * * *"; // Every day at midnight
const WEEKLY = "0 0 * * 0"; // Every week on Sunday at midnight

async function endOldCardsJob(gameController) {
    try {
        endOldCards(gameController);
    } catch (error) {
        console.error("Error ending old cards (cron):", error);
    }
}

async function addTokensJob(supabase) {
    try {
        const { error } = await supabase.rpc("add_n_tokens_all", {
            inc: 3,
        });
        if (error) {
            console.error("Error adding tokens (cron):", error);
        }
    } catch (error) {
        console.error("Error adding tokens (cron):", error);
    }
}

module.exports = {
    endOldCardsJob,
    addTokensJob,
    MIDNIGHTLY,
    WEEKLY,
};
