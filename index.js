import express from "express";
const cors = require('cors');
import { createTable } from "./db/db.js";
import { projectsRoutes } from "./routes/projectsRoute.js";
import { tasksRoutes } from "./routes/taskRoutes.js";
import { usersRoute } from "./routes/userRoute.js";
import { commentRoute } from "./routes/commentsRoute.js";
import { configDotenv } from "dotenv";
import authHandler from "./middleware/authToken.js";
createTable();
configDotenv();
const app = express();

// Enable CORS for all origins (good for dev)
app.use(cors());

// Or more securely:
// app.use(
//   cors({
//     origin: 'http://localhost:5173', // your frontend origin
//     methods: ['GET', 'POST',],
//     credentials: true, // if using cookies or sessions
//   })
// );

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
