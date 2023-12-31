const auth = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const { commonExpense } = require("../controllers/commonexpense");
const { dExpense, getExpenses } = require("../controllers/commonexpense");
const { sExpense, showExpenses } = require("../controllers/commonexpense");
const { deleteExpense } = require("../controllers/commonexpense");
router.route("/commonExpense").post(auth, commonExpense).get(auth, getExpenses);
router.route("/dexpense").post(auth, dExpense).get(auth, showExpenses);
router.route("/sexpense").post(auth, sExpense);
router.route("/deleteexpense").post(auth, deleteExpense);
module.exports = router;
