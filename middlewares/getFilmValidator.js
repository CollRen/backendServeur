const { check } = require("express-validator"); // Librairie pour valider

const getFilmValidator = [
  [check("id").escape().trim().notEmpty().isString().exists()],
];

module.exports = getFilmValidator;
