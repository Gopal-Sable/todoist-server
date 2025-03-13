import express from "express";
import { createTable } from "./db/db.js";
import { projectsRout } from "./routes/projectsRoute.js";
createTable();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use("/api/projects", projectsRout);

app.use("/", (req, res) => {
    res.status(200).json({ msg: "Hello" });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
