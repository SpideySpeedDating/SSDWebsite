const controller = require("../controllers/answersController");
const router = require("express").Router();
const middleware =  require("../middleware/verify");

module.exports = () => {
   router.get("/all", middleware.ensureAuthenticated , controller.findAllUserAnswers);
   router.post("/create", middleware.ensureAuthenticated, controller.createAnswer);

   return router;
};