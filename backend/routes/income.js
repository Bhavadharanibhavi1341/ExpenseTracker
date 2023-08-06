const auth = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const { monthIncome } = require("../controllers/monthincome");
const { uIncome } = require("../controllers/monthincome");
const { getIncome } = require("../controllers/monthincome");

router.route("/monthIncome").post(auth, monthIncome).get(auth, getIncome);
router.route("/uincome").post(auth, uIncome);

module.exports = router;
