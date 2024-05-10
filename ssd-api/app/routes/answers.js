const controller = require("../controllers/answersController");
const router = require("express").Router();
const middleware = require("../middleware/verify");

module.exports = () => {
   router.get("/", middleware.ensureAuthenticated, controller.findUserAnswer);
   router.get("/all", middleware.ensureAuthenticated, controller.findAllUsersAnswers);
   router.get("/random", middleware.ensureAuthenticated, controller.randomUserAnswers);
   router.post("/create", middleware.ensureAuthenticated, controller.createAnswer);

   return router;
};