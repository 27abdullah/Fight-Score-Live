const { param, body } = require("express-validator");

const createRoomValidation = [
    body("name").isString().notEmpty().escape(),
    body("fights").isArray({ min: 1, max: 20 }),
    body("fights.*.sport").isString().notEmpty().escape(),
    body("fights.*.fighterA")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: 20 })
        .escape(),
    body("fights.*.fighterB")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: 20 })
        .escape(),
    body("fights.*.totalRounds").isInt({ min: 1, max: 15 }),
];

const finishValidation = [
    body("id").isString().notEmpty().isMongoId(),
    body("winner").isString().notEmpty().escape().isLength({ min: 1, max: 20 }),
    body("outcome").isString().notEmpty().isIn(["KO", "TKO", "DQ"]),
];

const setWinnerValidation = [
    body("id").isString().notEmpty().isMongoId(),
    body("winner").isString().notEmpty().escape().isLength({ min: 1, max: 20 }),
];

const bodyIdValidation = [body("id").isString().notEmpty().isMongoId()];

const hostMessageValidation = [
    body("id").isString().notEmpty().isMongoId(),
    body("message")
        .isString()
        .notEmpty()
        .escape()
        .isLength({ min: 1, max: 30 }),
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
