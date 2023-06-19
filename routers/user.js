const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

router.post("/login", userController.loginUser);
router.post("/register", userController.createUser);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteAccount/:id", userController.deleteUser);
router.post("/resetPassword/", userController.resetPasswordFromProfile);



module.exports = router;
