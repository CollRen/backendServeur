const express = require("express");
const router = express.Router();

// Route "/users/"
router.get("/", (req, res) => {
res.send("Liste des utilisateurs");
});

// Route "/users/:id"
router.get("/:id", (req, res) => {
res.send(`Utilisateur ${req.params.id}`);
});

module.exports = router;
