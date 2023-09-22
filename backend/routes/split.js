const auth = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const {
  addGroup,
  getGroup,
  upGroup,
  Status,
  getStatus,
  upStatus,
} = require("../controllers/split");
router.route("/addgroup").post(auth, addGroup).get(auth, getGroup);
router.route("/upgroup").post(auth, upGroup);
router.route("/status").post(auth, Status).get(auth, getStatus);
router.route("/upstatus").post(auth, upStatus);
module.exports = router;
