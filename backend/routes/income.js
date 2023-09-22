const auth = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const { monthIncome } = require("../controllers/monthincome");
const { uIncome } = require("../controllers/monthincome");
const { getIncome, getSavings } = require("../controllers/monthincome");

router.route("/monthIncome").post(auth, monthIncome).get(auth, getIncome);
router.route("/uincome").post(auth, uIncome);
router.route("/getsavings").get(auth, getSavings);

module.exports = router;
