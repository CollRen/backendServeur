const express = require("express");
const router = express.Router();
const db = require("../data/db");

async function dataExist(req, res) {

  reference = await db.collection("films").doc(req.params.id).get();
  if (!reference.exists) {
    return false
  }
  return reference;
}

module.exports = dataExist;
