const controller = require("../controllers/questionsController");
const router = require("express").Router();
const middleware =  require("../middleware/verify");

module.exports = () => {
   router.get("/", middleware.ensureAuthenticated, controller.findAllQuestions);

   return router;
};