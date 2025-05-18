const { param, body } = require("express-validator");
const {
    FIGHTER_NAME_MAX_LENGTH,
    FIGHT_NAME_MAX_LENGTH,
    MAX_TOTAL_ROUNDS,
    MAX_FIGHTS,
    MAX_HOST_MESSAGE_LENGTH,
    FIGHT_OUTCOMES,
    WINNERS,
    SPORTS,
} = require("../utils");

const createRoomValidation = [
    body("name")
        .isString()
        .notEmpty()
        .escape()
        .isLength({ min: 1, max: FIGHT_NAME_MAX_LENGTH }),
    body("fights").isArray({ min: 1, max: MAX_FIGHTS }),
    body("fights.*.sport").isString().notEmpty().escape().isIn(SPORTS),
    body("fights.*.fighterA")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: FIGHTER_NAME_MAX_LENGTH })
        .escape(),
    body("fights.*.fighterB")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: FIGHTER_NAME_MAX_LENGTH })
        .escape(),
    body("fights.*.totalRounds").isInt({ min: 1, max: MAX_TOTAL_ROUNDS }),
];

const finishValidation = [
    body("id").isString().notEmpty().isMongoId(),
    body("winner").isString().notEmpty().escape().isIn(WINNERS),
    body("outcome").isString().notEmpty().isIn(FIGHT_OUTCOMES),
];

const setWinnerValidation = [
    body("id").isString().notEmpty().isMongoId(),
    body("winner").isString().notEmpty().escape().isIn(WINNERS),
];

const bodyIdValidation = [body("id").isString().notEmpty().isMongoId()];

const hostMessageValidation = [
    body("id").isString().notEmpty().isMongoId(),
    body("message")
        .isString()
        .notEmpty()
        .escape()
        .isLength({ min: 1, max: MAX_HOST_MESSAGE_LENGTH }),
];

const paramIdValidation = [param("id").isString().notEmpty().isMongoId()];

module.exports = {
    createRoomValidation,
    bodyIdValidation,
    finishValidation,
    setWinnerValidation,
    hostMessageValidation,
    paramIdValidation,
};
