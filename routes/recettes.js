const express = require("express");
const router = express.Router();
const db = require("../data/db");
const { check, validationResult } = require("express-validator"); // Librairie pour valider
const getFilmsValidator = require("../middlewares/getFilmsValidator");
const getFilmValidator = require("../middlewares/getFilmValidator");
const postFilmValidator = require("../middlewares/postFilmValidator");
const validationError = require("../middlewares/validationError");
const dataExist = require("../validations/dataExist");
const auth = require("../middlewares/auth.js");


router.get('/', (req, res) => {
    db.query('SELECT * FROM `auteur` AS solution', function (error, results, fields) {
        if (error) throw error;
        
        console.log(error, results, fields);
    });
}
)

module.exports = router;