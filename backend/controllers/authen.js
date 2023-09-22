const User = require("../models/User");
const Expense = require("../models/commonExpense");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { json } = require("express");

const getName = async (req, res) => {
  try {
    const userName = req.params.userName;

    const existingUser = await User.findOne({ userName });

    res.status(StatusCodes.OK).json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const existingUser = await User.findOne({ email });
    res.status(StatusCodes.OK).json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signup = async (req, res) => {
  console.log({ ...req.body });

  const { userName, email, password } = req.body;
  console.log(userName, email, password, "printingg");
  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Username already exists" });
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email already exists" });
  }

  const user = await User.create({ ...req.body });
  console.log("success");
  const token = user.createJwt();
  const expense = new Expense(req.body);
  expense.createdBy = user.id;
  await expense.save();
  res.status(StatusCodes.OK).json({ token, user });
  // res.status(200).json({msg:"success"});
};
const login = async (req, res) => {
  console.log("logged");
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    console.log(user);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "user does not exists" });
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "password is incorrect" });
  }
  const token = user.createJwt();
  res.status(StatusCodes.OK).json({ token, user });
};
const getUsers = async (req, res) => {
  const avlUser = await User.find();
  console.log(avlUser);
  res.status(200).json(avlUser);
};
const forgetpassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true, runValidators: true }
  );
  console.log(user);
  if (!user) {
    throw new UnauthenticatedError("Please enter valid email");
  }
  res.status(200).json({ msg: "success" });
};

module.exports = { signup, login, forgetpassword, getUsers, getName, getEmail };
