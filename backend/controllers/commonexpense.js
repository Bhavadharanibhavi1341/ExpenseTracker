const Expense = require("../models/commonExpense");
const DailyExpense = require("../models/daily");
const monthIncome = require("../models/monthIncome");
const Income = require("../models/monthIncome");
let totalExpense = 0;
let savings = 0;
const commonExpense = async (req, res) => {
  const user = req.user;
  // console.log({...req.body});
  console.log(user.id);
  const isUser = await Expense.findOne({ createdBy: user.id });
  if (!isUser) {
    const expense = new Expense(req.body);
    expense.createdBy = user.id;
    await expense.save();
  } else {
    console.log(req.body);
    const existing = [...isUser.commonExpense, ...req.body.commonExpense];
    console.log(existing);
    const value = await Expense.findOneAndUpdate(
      { createdBy: user.id },
      { commonExpense: existing }
    );
    // getExpenses();
    const r = await Expense.findOne({ createdBy: user.id });
    res.status(200).json(r.commonExpense);
    // const val = await Expense.replaceOne(
    //   { createdBy: user.id },
    //   {   commonExpense:  existing}
    // );
    // console.log(value);
  }

  // const expense =await Expense.create({...req.body,createdBy:user.id});
  // console.log("success");
  // res.status(200).json({ msg: "success" });
};

const dExpense = async (req, res) => {
  const user = req.user;
  console.log(req.body);
  const { dExpense } = req.body;
  const { amount } = dExpense;
  const val = new DailyExpense({
    ...req.body.dExpense,
    createdBy: user.id,
    createdAt: Date.now(),
  });
  await val.save();
  const inc1 = await Income.find({ createdBy: user.id });

  if (inc1[0].monthIncome >= amount) {
    const income = await Income.updateOne(
      { createdBy: user.id },
      { $inc: { monthIncome: -amount } }
    );
  } else if (inc1[0].monthIncome > 0) {
    let remaining = amount - inc1[0].monthIncome;
    const income = await Income.updateOne(
      { createdBy: user.id },
      { $inc: { monthIncome: -inc1[0].monthIncome, savings: -remaining } }
    );
  } else {
    const income = await Income.updateOne(
      { createdBy: user.id },
      { $inc: { savings: -amount } }
    );
  }

  // const income = await Income.find(
  //   { createdBy: user.id },
  //   { $set: { monthIncome: uIncome } }
  // );
  totalExpense = 0;
  const rep = await DailyExpense.find({ createdBy: user.id });
  const inc = await Income.find({ createdBy: user.id });
  rep.filter(function (item) {
    totalExpense = totalExpense + item.amount;
  });

  c = { inc, rep, totalExpense };
  res.status(200).json(c);
};

const sExpense = async (req, res) => {
  const user = req.user;
  const { sMonth, sYear } = req.body;

  const val = await DailyExpense.find({
    $expr: {
      $and: [
        {
          $eq: [
            {
              $month: "$createdAt",
            },
            sMonth,
          ],
        },
        {
          $eq: [
            {
              $year: "$createdAt",
            },
            sYear,
          ],
        },
        {
          $eq: ["$createdBy", user.id],
        },
      ],
    },
  }).exec();
  console.log(val);
  totalExpense = 0;
  val.filter(function (item) {
    totalExpense = totalExpense + item.amount;
  });
  console.log(totalExpense);

  res.status(200).json([val, totalExpense]);
};
const showExpenses = async (req, res) => {
  const user = req.user;
  totalExpense = 0;
  const rep = await DailyExpense.find({ createdBy: user.id });
  rep.filter(function (item) {
    totalExpense = totalExpense + item.amount;
  });

  res.status(200).json([rep, totalExpense]);
};

const getExpenses = async (req, res) => {
  const user = req.user;
  const r = await DailyExpense.findOne({ createdBy: user.id });
  r.filter(function (item) {
    totalExpense = totalExpense + item.amount;
  });
  console.log(totalExpense);
  res.status(200).json([r.commonExpense, totalExpense]);
};

const deleteExpense = async (req, res) => {
  const user = req.user;
  console.log(req.body);
  totalExpense = 0;
  console.log(req.body.delete, "idfor expense");
  const delete1 = await DailyExpense.deleteOne({ _id: req.body.delete });
  const income = await Income.updateOne(
    { createdBy: user.id },
    { $inc: { monthIncome: req.body.amtt } }
  );
  const income1 = await Income.findOne({ createdBy: user.id });

  const rep = await DailyExpense.find({ createdBy: user.id });
  rep.filter(function (item) {
    totalExpense = totalExpense + item.amount;
  });
  console.log(income1);
  res.status(200).json([rep, totalExpense, income1.monthIncome]);
};
module.exports = {
  commonExpense,
  dExpense,
  sExpense,
  getExpenses,
  deleteExpense,
  showExpenses,
};
