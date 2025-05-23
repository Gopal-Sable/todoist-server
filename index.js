import express from "express";
import cors from "cors";
import { createTable } from "./db/db.js";
import { projectsRoutes } from "./routes/projectsRoute.js";
import { tasksRoutes } from "./routes/taskRoutes.js";
import { usersRoute } from "./routes/userRoute.js";
import { commentRoute } from "./routes/commentsRoute.js";
import { configDotenv } from "dotenv";
import authHandler from "./middleware/authToken.js";
import cookieParser from "cookie-parser";

createTable();
configDotenv();
const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    })
);

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use("/api/projects", authHandler, projectsRoutes);
app.use("/api/tasks", authHandler, tasksRoutes);
app.use("/api/users", usersRoute);
app.use("/api/comment", commentRoute);
app.use("/", (req, res) => {
    res.status(404).json({ msg: "Page not found" });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
