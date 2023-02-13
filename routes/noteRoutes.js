const express = require("express");
const router = express.Router();
const usersController = require("../controllers/notesController.js");

router
  .route("/")
  .get(usersController.getAllNotes)
  .post(usersController.createNewNote)
  .patch(usersController.updateNote)
  .delete(usersController.deleteNote);

module.exports = router;
