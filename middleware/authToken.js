import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
configDotenv();
const JWT_SECRETE = process.env.JWT_SECRETEKEY;
const authHandler = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res
            .status(400)
            .json({ message: "Authentication key not provided" });
    }
    try {
        let user = jwt.verify(token, JWT_SECRETE);
        req.user = user;
        next();
    } catch (error) {
        res.json(error);
        // return res.status(401).json({ message: "Authentiaction failed" });
    }
};

export default authHandler;
