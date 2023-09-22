const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const authenRouter = require("./routes/auth");
const cexpenserouter = require("./routes/commonexpenses");
const connect = require("./db/connect");
const userAuthentication = require("./middleware/authentication");
const user = require("./models/User");
const inrouter = require("./routes/income");
const split = require("./routes/split");

app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authenRouter);
app.use("/api/v1/expense", cexpenserouter);
app.use("/api/v1/income", inrouter);
app.use("/api/v1/split", split);

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT;
const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(PORT, async (req, res) => {
      console.log(`Server is listening to port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

// var array=[];
// var i=0;

// app.post('/upload', function(req, res) {

//     var value=req.body;
//     console.log({body: req.body});
//     array.push(value);
//     console.log(array);
//     if (!value){
//        console.log("error") ;
//     }
//     else{
//         res.send(value);

//     }

// })
