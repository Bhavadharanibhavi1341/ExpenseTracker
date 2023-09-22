const nodemailer = require("nodemailer");
const Group = require("../models/splitpay");
const status = require("../models/status");
const User = require("../models/User");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // port: 465,
  // secure: true, // use SSL
  port: 587,
  secure: false,
  auth: {
    user: "bhavi130401@gmail.com",
    pass: "xdzihqldfqcwhkij",
  },
});

const addGroup = async (req, res) => {
  const user = req.user;
  console.log({ ...req.body.addGroup });
  const group = new Group({ ...req.body.addGroup });
  group.createdBy = user.id;
  await group.save();
  console.log("success");
  let mailAddresses = [];
  for (let i = 0; i < req.body.addGroup.details.length; i++) {
    const user1 = await User.findOne({
      userName: req.body.addGroup.details[i].UserName,
    });
    mailAddresses.unshift(user1.email);
  }

  const mailOptions = mailAddresses.map((toAddress) => ({
    from: "bhavi130401@gmail.com",
    to: toAddress,
    subject: "Group Created",
    html: `
        <html>
            <body>
                <p>Hello,</p>
                <p>You have successfully created the group "<strong>${req.body.addGroup.splitPayName}</strong>".</p>
                <p>Regards,</p>
                <p>Expensify</p>
            </body>
        </html>
    `,
  }));

  mailOptions.forEach((options) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });

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
const Status = async (req, res) => {
  console.log(req.body);
  const statuses = new status(req.body.updateGroup);
  await statuses.save();
  res.status(200).json("splitttt");
};

const getStatus = async (req, res) => {
  const user = req.user;
  console.log("welcome user");
  console.log("hellooo", user.userName);
  const group = await status.find({
    "details.name": user.userName,
  });
  console.log(group);
  res.status(200).json(group);
};
const upStatus = async (req, res) => {
  console.log("seeoeoeo", req.body.updatestatus.array[0].details, "helokoiuth");
  const valuestatus = await status.updateOne(
    { _id: req.body.updatestatus.id },
    {
      $set: { details: req.body.updatestatus.array[0].details },
    }
  );
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
module.exports = { addGroup, getGroup, upGroup, Status, getStatus, upStatus };
