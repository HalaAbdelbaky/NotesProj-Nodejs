const express = require('express')
const router = express.Router()
const usersController = require('../Controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const userId=require("./auth.routes")

router.use(verifyJWT)

// router.get("userProfile/:id",usersController.getUserById)


router.route("/userProfile/users")
.get(usersController.getAllUsers);


router.route("/userProfile/:id")
.get(usersController.getUserById);


router.route("/userProfile/users/new")
.post(usersController.createNewUser);


// router.route('/')
//   .get(usersController.getAllUsers)
//   .post(usersController.createNewUser)
//   .patch(usersController.updateUser)
//   .delete(usersController.deleteUser)

module.exports = router
