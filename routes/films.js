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

// Package permettant d'enregister l'image
// const multer = require("multer");

// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "public/img");
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.originalname);
//     },
// });
// let upload = multer({
//     storage: storage,
// });


//Route permettant l'ajout d'image
//Ne pas oublié d'importer le package dans le haut du fichier
// router.post("/upload-image", auth, upload.single("image"), (req, res) => {
//     try {
//         console.log(req.body, req.file);
//         res.statusCode == 200;
//         return res.json({ message: "L'image a été enregistrée" });
//     } catch (erreur) {
//         res.statusCode = 500;
//         return res.json({ message: "Une erreur est survenue lors de l'enregistrement de l'image" });
//     }
// });



router.get("/", getFilmsValidator, validationError, async (req, res) => {
  try {
    const ordre = req.query.ordre || "asc";
    const limit = parseInt(req.query.limit);
    const champs = req.query.champs || "titre";

    let references = await db.collection("films").orderBy(champs, ordre);

    if (limit) references = await references.limit(limit);

    references = await references.get();
    const filmsTrouves = [];
    references.forEach((doc) => {
      const docData = { id: doc.id, ...doc.data() };
      filmsTrouves.push(docData);
    });

    // En cas de vide
    if (filmsTrouves.length == 0) {
      res.statusCode = 404;
      return res.json({ message: "Aucun film trouvé" });
    }
    res.statusCode = 200;
    res.json(filmsTrouves);
  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

/**
 * req.params.id pour récupérer la donnée
 */
router.get(
  "/:id",
  getFilmValidator, validationError, async (req, res) => {
    try {
      
      const reference = await dataExist(req, res);
      if(!reference) {
        res.statusCode = 404;
        return res.json({ message: "Aucun film trouvé" });
      }

      res.statusCode = 200;
      let data = reference.data();
      res.json(data);
    } catch (error) {
      res.statusCode = 500;
      return res.json({ message: error.message });
    }
  }
);

/**
 * Ajouter un nouveau film
 * @param auth seulement pour un utilisateur authorisé
 */
router.post(
  "/", auth, postFilmValidator, validationError, async (req, res) => {
    // Validation via bibliothèque de validation à installer
    try {
      const validation = validationResult(req);

      if (!validation.isEmpty()) {
        res.statusCode = 400;
        return res.json({
          message: "Données invalidess",
          errors: validation.errors,
        });
      }

      const donnees = req.body;

      const nouveauFilm = await db.collection("films").add(donnees);
      donnees.id = nouveauFilm.id;

      res.statusCode = 200;
      return res.json(donnees);
    } catch (error) {
      res.statusCode = 500;
      return res.json({ message: error.message });
    }
  }
);

/**
 * Initialisation des films
 * @param auth seulement pour un utilisateur authorisé
 */
router.post("/initialiser", auth, (req, res) => {
  try {
    const dataInit = require("./data/filmsDepart");

    dataInit.forEach(async (film) => {
      await db.collection("films").add(film);
    });
    res.statusCode = 200;
    return res.json({ message: "Liste de films initialisée" });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

/**
 * Update film avec id
 * @param auth seulement pour un utilisateur authorisé
 */
router.put("/:id", auth, async (req, res) => {
  try {

    // const reference = await dataExist(req, res);
    
    const id = req.params.id;
    const film = req.body;


    await db.collection("films").doc(id).update(film);
    res.statusCode = 200;
    return res.json(film);
    // res.json({ message: `Le document avec l'id ${id} a été modifié` });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Effacer un film avec l'id
 * @param auth seulement pour un utilisateur authorisé
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log(req);
    const id = req.params.id;
    await db.collection("films").doc(id).delete();
    res.statusCode = 200;
    res.json({ message: `Le film avec l'id ${id} a été supprimé` });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Ne fonctionne pas, va dans la route 'Effacer un film avec l'id'
 * Qui plus est... n'affiche pas de message d'erreur.
 * @param auth seulement pour un utilisateur authorisé
 */
router.delete("/deleteall", auth, async (req, res) => {
  return "Non, on accepte pas de tout deleter!";
  try {
    const docs = await db.collection("films").get();
    docs.forEach((doc) => {
      doc.ref.delete();
    });
    res.statusCode = 200;
    res.json({ message: `Tous les documents ont été supprimés` });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
