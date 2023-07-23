const express = require('express')
const router = express.Router()
const notesController = require('../Controllers/notesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route("/userProfile/notes/edit/:id")
.patch(notesController.updateNote);

router.route(["/userProfile/notes/new"])
.post(notesController.createNewNote);

router.route("/userProfile/notes/view/:id")
.get(notesController.getNotesOfUser);




router.route("/userProfile/notes/edit/:id")
.get(notesController.editeNote);




// router.route('/')
//   .get(notesController.getAllNotes)
//   .post(notesController.createNewNote)
//   .patch(notesController.updateNote)
//   .delete(notesController.deleteNote)

module.exports = router
