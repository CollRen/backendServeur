const express = require("express");
const router = express.Router();
const db = require("../data/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
router.get("/", async (req, res) => {
  try {
    const references = await db.collection("utilisateurs").get();
    const utilisateurs = [];
    references.forEach((doc) => {
      let docData = doc.data();
      utilisateurs.push(docData);
    });

    // En cas de vide
    if (utilisateurs.length == 0) {
      res.statusCode = 404;
      return res.json({ message: "Aucun utilisateur trouvé" });
    }
    res.statusCode = 200;
    res.json(utilisateurs);
  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

/**
 * Inscription à l'api avec courriel et mdp
 */
router.post("/inscription", async (req, res) => {
  try {
    const { courriel, mdp } = req.body;

    // Vérifier si l'utilisateur existe (Faudra tout de même vérifier le tableau)
    const references = await db
      .collection("utilisateurs")
      .where("courriel", "==", courriel)
      .get();

    const utilisateurs = [];
    references.forEach((doc) => {
      let docData = doc.data();
      utilisateurs.push(docData);
    });

    /**
     * Test réalisé et réussi
     */
    if (utilisateurs.length >= 0) {
      for (let i = 0; i < utilisateurs.length; i++) {
        if (utilisateurs[i].courriel == courriel) {
          res.statusCode = 404;
          return res.json({ message: "Ce compte existe déjà" });
        }
      }
    }


    // hash le mot de passe
    const hash = await bcrypt.hash(mdp, 10);
    const user = {
      courriel,
      mdp: hash,
    };

    // Ajout à la bd et message de succès
    await db.collection("utilisateurs").add(user);
    res.statusCode = 201;
    res.json({ message: "Succès" });

  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

/**
 * @route POST /connexion
 * @description Cette route permet à un utilisateur de se connecter. Elle vérifie d'abord si l'email fourni existe dans la base de données. Si c'est le cas, elle compare le mot de passe fourni avec le mot de passe hashé stocké dans la base de données. Si les mots de passe correspondent, elle renvoie les informations de l'utilisateur avec un token.
 */
router.post(
  "/connexion",
  [check("mdp").escape().trim().notEmpty(), check("courriel").escape().trim().notEmpty()],
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (!validation.isEmpty()) {
        return res.status(400).json({ message: "Données invalides" });
      }
      const motDePasse = req.body.mdp;
      const courriel = req.body.courriel;

      const docRef = await db.collection("utilisateurs").where("courriel", "==", courriel).get();
      const utilisateurs = [];

      docRef.forEach(async (doc) => {
        utilisateurs.push({ id: doc.id, ...doc.data() });
      });

      const utilisateur = utilisateurs[0];

      if (utilisateur === undefined) {
        res.statusCode = 400;
        res.json({ message: "Le courriel n'existe pas" });
      } else {
        const resultatConnexion = await bcrypt.compare(motDePasse, utilisateur.mdp);
        console.log(utilisateur, motDePasse);
        if (resultatConnexion) {
          const donneesJeton = {
            id: utilisateur.id,
            courriel: utilisateur.courriel,
          };

          const options = {
            expiresIn: "1d",
          };

          const jeton = jwt.sign(donneesJeton, process.env.JWT_SECRET, options);
          res.json(jeton);
        } else {
          res.statusCode = 400;
          res.json({ message: "Mot de passe incorrect" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;
