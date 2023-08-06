const auth = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const { addGroup, getGroup, upGroup } = require("../controllers/split");
router.route("/addgroup").post(auth, addGroup).get(auth, getGroup);
router.route("/upgroup").post(auth, upGroup);
module.exports = router;
