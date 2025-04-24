import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

const JWT_SECRETE = process.env.JWT_SECRETEKEY;

const authHandler = async (req, res, next) => {
  let token = null;
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  else if (req.headers.authorization) {
    token = req.headers.authorization;

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication token not provided" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRETE);
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default authHandler;
