const Income = require("../models/monthIncome");
const save = require("../models/savings");
const mongoose = require("mongoose");
const monthIncome = async (req, res) => {
  const user = req.user;
  console.log(user.id);

  const income = new Income(req.body);
  income.createdBy = user.id;
  await income.save();
  console.log("success");
  res.status(200).json({ msg: "success" });
};
const getSavings = async (req, res) => {
  const user = req.user;

  const r = await save.find({ createdBy: user.id });

  res.status(200).json(r);
};

const uIncome = async (req, res) => {
  const user = req.user;
  console.log(user.id);
  const { monthIncome } = req.body;
  const uIncome = monthIncome;
  // const income=new Income(req.body)
  // income.createdBy=user.id;
  const r = await Income.findOne({ createdBy: user.id });
  if (r != null) {
    const { monthIncome, savings } = r;
    const usave = monthIncome + savings;
    const income = await Income.updateOne(
      { createdBy: user.id },
      { $set: { monthIncome: uIncome, savings: usave } }
    );
    const now = new Date();
    const beginningOfPreviousMonth = now.getMonth();
    const yearr = now.getFullYear();
    if (beginningOfPreviousMonth == 0) {
      beginningOfPreviousMonth = 12;
      yearr = yearr - 1;
    }
    const saving = new save({
      savings: monthIncome,
      month: beginningOfPreviousMonth,
      year: yearr,
    });
    saving.createdBy = user.id;
    await saving.save();
  } else {
    const income = new Income(req.body);
    income.createdBy = user.id;
    await income.save();
  }
  const r1 = await Income.findOne({ createdBy: user.id });
  console.log(r1);

  res.status(200).json(r1);
};
const getIncome = async (req, res) => {
  const user = req.user;
  const r = await Income.findOne({ createdBy: user.id });
  if (r != null) {
    res.status(200).json(r);
  } else {
    res.status(200).json(0);
  }
};

module.exports = { monthIncome, uIncome, getIncome, getSavings };
