const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

const {
  signup,
  login,
  forgetpassword,
  getUsers,
  getName,
  getEmail,
} = require("../controllers/authen");

router.route("/signup").post(signup);
router.route("/getname/:userName").get(getName);
router.route("/getemail/:email").get(getEmail);
router.route("/login").post(login).get(auth, getUsers);
router.route("/forgetpassword").patch(forgetpassword);

module.exports = router;
