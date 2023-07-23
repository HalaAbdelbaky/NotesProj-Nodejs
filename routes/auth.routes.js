const controller = require("../Controllers/auth.controller");
const router=require("express").Router()


router.route('/login')
  .post(controller.login)


  const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


  router.route('/welcomePage')
  .get(controller.dashboard);

  router.route('/refresh')
  .get(controller.refresh)

router.route('/userProfile/:id')
  .get(controller.logout)

module.exports = router

