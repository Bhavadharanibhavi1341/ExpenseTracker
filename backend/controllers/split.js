const Group = require("../models/splitpay");

const addGroup = async (req, res) => {
  const user = req.user;
  console.log({ ...req.body.addGroup });
  const group = new Group({ ...req.body.addGroup });
  group.createdBy = user.id;
  await group.save();
  console.log("success");
  const group1 = await Group.find({
    "details.UserName": user.userName,
  });
  console.log("crtttt");
  res.status(200).json(group1);
  console.log("hellooo");
};
const getGroup = async (req, res) => {
  const user = req.user;
  console.log("hellooo", user.userName);
  const group = await Group.find({
    "details.UserName": user.userName,
  });
  res.status(200).json(group);
};
const upGroup = async (req, res) => {
  console.log(req.body.updateGroup.details);
  const group = await Group.updateOne(
    { _id: req.body.updateGroup.id },
    { $set: { details: req.body.updateGroup.details } }
  );
  console.log("niceee", group);
  res.status(200).json("donee");
};
module.exports = { addGroup, getGroup, upGroup };
