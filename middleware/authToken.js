// import { configDotenv } from "dotenv";
// import jwt from "jsonwebtoken";

// configDotenv();

// const JWT_SECRETE = process.env.JWT_SECRETEKEY;

// const authHandler = async (req, res, next) => {
//   let token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ message: "Authorization token not provided" });
//   }

//   // Support for "Bearer <token>" format
//   if (token.startsWith("Bearer ")) {
//     token = token.slice(7).trim();
//   }

//   try {
//     const user = jwt.verify(token, JWT_SECRETE);
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error.message);
//     return res.status(401).json({ message: "Authentication failed" });
//   }
// };

// export default authHandler;

import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

const JWT_SECRETE = process.env.JWT_SECRETEKEY;

const authHandler = async (req, res, next) => {
  let token = null;

  // Check cookie first
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Fallback to Authorization header if cookie not found
  else if (req.headers.authorization) {
    token = req.headers.authorization;

    // Handle "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
  }

  // If no token provided at all
  if (!token) {
    return res.status(401).json({ message: "Authentication token not provided" });
  }

  // Try verifying the token
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
