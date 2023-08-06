const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

const {
  signup,
  login,
  forgetpassword,
  getUsers,
} = require("../controllers/authen");

router.route("/signup").post(signup);
router.route("/login").post(login).get(auth, getUsers);
router.route("/forgetpassword").patch(forgetpassword);

module.exports = router;
