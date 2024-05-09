const controller = require("../controllers/answersController");
const router = require("express").Router();
const middleware =  require("../middleware/verify");

module.exports = () => {
   router.get("/", middleware.ensureAuthenticated , controller.findUserAnswer);
   router.get("/all", middleware.ensureAuthenticated , controller.findAllUsersAnswers);
   router.post("/create", middleware.ensureAuthenticated, controller.createAnswer);
   router.get("/status", (req, res) => {
      const status = {
          "Status": "Running"
      }
  
      return res.send(status)
  });
   
   return router;
};