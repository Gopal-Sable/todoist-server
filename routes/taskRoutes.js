import { Router } from "express";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/taskController.js";

const tasksRoutes = Router();
// fetch all tasks
tasksRoutes.get("/", getTasks);
// fetch task by id
tasksRoutes.get("/project/:id", getTasks);
//Create task
tasksRoutes.post("/", createTask);
//  update task by id
tasksRoutes.patch("/:id", updateTask);
// delete task by id
tasksRoutes.delete("/:id", deleteTask);
export { tasksRoutes };
