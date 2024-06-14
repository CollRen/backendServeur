const { check } = require("express-validator"); // Librairie pour valider

const postFilmValidator = [
  [
    check("titre").escape().trim().notEmpty().isString().isLength({
      min: 1,
      max: 60,
    }),
    check("genres").escape().trim().notEmpty().isArray({ min: 0 }),
    check("description").escape().trim().notEmpty().isString().isLength({
      min: 1,
      max: 255,
    }),
    check("annee").escape().trim().notEmpty().matches("^[1-2][0-9][0-9]{2}$").isLength({
      min: 1,
      max: 25,
    }),
    check("realisation").escape().trim().notEmpty().isString().isLength({
      min: 1,
      max: 60,
    }),
    check("titreVignette").escape().trim().notEmpty().isString().matches("^.*.(jpg|jpeg|gif|png|webp)$").isLength({
      min: 1,
      max: 100,
    }),
  ],
];

module.exports = postFilmValidator;
