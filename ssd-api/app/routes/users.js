const controller = require('../controllers/usersController');
const router = require("express").Router();
const middleware =  require("../middleware/verify");

module.exports = () => {
   router.get("/all", middleware.ensureAuthenticated, controller.findAllUsers);
   router.get("/", middleware.ensureAuthenticated, controller.findUserByAuthId);
   router.put("/update", middleware.ensureAuthenticated, controller.updateUser);
   router.post('/', middleware.ensureAuthenticated, controller.createUser)
  return router;
};
