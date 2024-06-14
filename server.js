const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const server = express();
const db = require("./data/db"); 
const cors = require("cors"); // Ajouter IP ou domaine, sinon bar open à toutes demandes


// Doit être défini au début de l'application
const dotenv = require("dotenv");

/**
 * Gestion static ou dynamique dans un server
 */
dotenv.config();
server.use(cors());

/**
 * req.body pour récupérer le body du fetch..? à suivre
 */
server.use(express.json()); // Permet d'envoyer des json dans le body
server.use(express.urlencoded({extended:true})); // Permet de récupérer des formulaire html qui contiennent des fichiers

/**
 * On informe le server de l'endroit où se trouve ce fichier-ci
 * Ce dossier sera donc public
 * Cherchera là-dedans avant de chercher plus loin ici
 * La route "/", n'a donc plus besoin d'être ici
 */
server.use(express.static(path.join(__dirname, "public")));

/**  --- __DÉBUT DES ROUTES__ --- */

const filmsRoutes = require("./routes/films");
server.use("/api/films", filmsRoutes);

const usersRoutes = require("./routes/users");
server.use("/api/users", usersRoutes);

const utilisateursRoutes = require("./routes/utilisateurs");
server.use("/api/utilisateurs", utilisateursRoutes);



// Initialisation des utilisateurs
server.post("/api/utilisateurs/initialiser", (req, res) => {
  try {
    const dataInit = require("./data/donneesUtilisateursTest");

    dataInit.forEach(async (user) => {
      await db.collection("utilisateurs").add(user);
    });
    res.statusCode = 200;
    return res.json({ message: "Liste d'utilisateur est initialisée" });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});



// Section Routes Utilisateurs
server.post("/api/utilisateurs/inscription", (req, res) => {
  res.json("post utilisateur/inscription ok");
});

/* server.post("/api/utilisateurs/connexion", (req, res) => {
  res.json("post utilisateurs/connexion ok");
});
 */
server.delete("/api/utilisateurs/:id", (req, res) => {
  res.json("delete utilisateurs/:id ok");
});

server.put("/api/utilisateurs/:id", (req, res) => {
  res.json("edit utilisateurs/:id ok");
});

// Middleware -> Message d'erreur en cas... d'erreur
server.use((req, res) => {
  res.statusMessage = "Ressource non trouvée";
  res.status(404).json("Ressource non trouvée");
});

/**
 * npm run dev
 * Start server grâce au script ("dev": "nodemon server.js") /package.json
 * Doit être défini à la fin de l'application
 */
server.listen(process.env.PORT, () => {
  console.log("Vous êtes connecté au port" + process.env.PORT);
});

module.exports = server;
