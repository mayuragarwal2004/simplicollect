const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const db = require("../config/db"); // Assuming you have a db.js file for database connection

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user; // Attach user info to the request
    next();
  });
};

const AuthenticateAdmin =async (req, res, next) => {
  if(!req.user){
    return res.status(401).json({ message: "please authenticate first" });
  }
  const user = await db("members").where("memberId", req.user.memberId).first();
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  if (user.superAdmin==0) {
    return res.status(403).json({ message: "Access denied, you need to be an Admin" });
  }else{
    next();
  }
};
module.exports = { authenticateToken,AuthenticateAdmin };