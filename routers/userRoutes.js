const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");
const { checkAuth, isCustomer, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/details", checkAuth, isCustomer, authController.getUserData);
router.post("/update-user", checkAuth, isCustomer, authController.updateUserByAdmin);
// router.get("/all", checkAuth, isAdmin, authController.getAllUsers);
router.get("/all", authController.getAllUsers);
module.exports = router;
