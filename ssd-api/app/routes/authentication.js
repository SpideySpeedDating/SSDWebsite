const controller = require("../controllers/authorizationController");
const router = require("express").Router();

module.exports = () => {
   router.get("/", controller.authenticateUser);
   router.get("/generate_link", controller.generateLink)
   router.get("/verify", controller.validateLogin);

   return router;
};