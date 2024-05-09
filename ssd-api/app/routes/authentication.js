const controller = require("../controllers/authorizationController");
const router = require("express").Router();

module.exports = () => {
   router.get("/", controller.auth);

   return router;
};