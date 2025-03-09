const cardSchema = require("../model/card.model");
const CardState = require("./CardState");
const { wait, IN_PROGRESS, FINISHED } = require("../utils");

class GameController {
    constructor() {
        this.cards = new Map();
        this.redis = null;
    }

    async getCard(id) {
        if (id == null) return false;
        if (!(await this.hasId(id))) {
            console.error("Could not find card with id:", id);
            return null;
        }
        return this.cards.get(id);
    }

    createCard(owner, name, fights) {
        // Save card to mongo
        const card = new cardSchema({
            owner: owner,
            name: name,
            fights: fights,
        });
        card.save();

        // Add card (only required info) to redis
        const id = card._id.toString();
        const currentFight = {
            id: card._id,
            owner: owner,
            name: name,
            currentFight: 0,
            fighterA: fights[0].fighterA,
            fighterB: fights[0].fighterB,
            sport: fights[0].sport,
            totalRounds: fights[0].totalRounds,
            currentRound: 1,
            state: IN_PROGRESS,
        };
        this.redis.set(id, JSON.stringify(currentFight), (err, reply) => {
            if (err) {
                console.error("Redis error on createCard:", err);
            }
        });

        // Add card to map
        this.cards.set(id, new CardState(currentFight, this.redis));

        return id;
    }

    setRedis(redis) {
        this.redis = redis;
    }

    async hasId(id) {
        if (!this.cards.has(id)) {
            try {
                const value = await this.redis.get(id);
                this.cards.set(
                    id,
                    new CardState(JSON.parse(value), this.redis)
                );
                return true;
            } catch (err) {
                console.log("Could not find id in redis:", id);
                return false;
            }
        }
        return true;
    }

    clearCard(id) {
        this.redis.del(id, (err, reply) => {
            if (err) {
                console.error("Error deleting key:", err);
            }
        });
        this.cards.delete(id);
    }

    jsonify() {
        result = [];
        this.cards.forEach((id) => {
            this.redis.get(id, (err, card) => {
                if (err) {
                    console.error("Error retrieving value:", err);
                    return;
                }
                result.push(JSON.parse(card));
            });
        });
        return result;
    }
}
const gameController = new GameController();

module.exports = { gameController };
