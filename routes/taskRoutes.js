import { Router } from "express";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/taskController.js";

const tasksRoutes = Router();

tasksRoutes.get("/", getTasks);
tasksRoutes.get("/:id", getTasks);

tasksRoutes.post("/", createTask);

tasksRoutes.put("/:id", updateTask);
tasksRoutes.delete("/:id", deleteTask);
export { tasksRoutes };
