const { check } = require("express-validator"); // Librairie pour valider

const getFilmsValidator = [
  check("ordre").escape().trim().optional(true).isString().notEmpty().isLength({
    min: 1,
    max: 4,
  }),
  check("champs")
    .escape()
    .trim()
    .optional(true)
    .isString()
    .notEmpty()
    .isLength({
      min: 1,
      max: 25,
    }),
  check("limit").escape().trim().optional(true).isInt().notEmpty().isLength({
    min: 1,
    max: 8,
  }),
];

module.exports = getFilmsValidator;
