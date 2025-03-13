import express from "express";
import { createTable } from "./db/db.js";
import { projectsRoutes } from "./routes/projectsRoute.js";
import { tasksRoutes } from "./routes/taskRoutes.js";
createTable();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/", (req, res) => {
    res.status(200).json({ msg: "Hello" });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
