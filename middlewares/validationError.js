const { validationResult } = require("express-validator"); // Librairie pour valider


function validationError(req, res, next) {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res.statusCode = 400;
      return res.json({ message: "Données invalides", erreurs: validation });
    }
    next();
}

module.exports = validationError;