const controller = require("../controllers/usersController");
const router = require("express").Router();
const middleware = require("../middleware/verify");

module.exports = () => {
  router.get("/", middleware.ensureAuthenticated, controller.findUserByAuthId);
  router.put("/update", middleware.ensureAuthenticated, controller.updateUser);
  return router;
};
