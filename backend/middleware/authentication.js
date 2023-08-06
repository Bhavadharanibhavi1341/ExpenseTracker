const User = require('../models/User')
const { UnauthenticatedError } = require("../errors");
const jwt = require('jsonwebtoken')
require('dotenv')
const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(req.headers);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("123");
        throw new UnauthenticatedError("Authenticaton failed")
    }
    const token = authHeader.split(" ")[1]
    console.log(token);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        //attach the user to job routes
        const user =await User.findById(payload.userId).select('-password')
        req.user=user
        // console.log(payload);
        // req.user = { userId: payload.userId, name: payload.name }
        console.log(req.user,"authorized");
        next()
    } catch (error) {
        throw new UnauthenticatedError("error in payload")
    }
}

module.exports = auth