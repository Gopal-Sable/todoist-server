import { Router } from "express";
import {
    createProject,
    deleteProject,
    getAllProjects,
    updateProject,
} from "../controllers/projectsController.js";

const projectsRoutes = Router();

projectsRoutes.get("/", getAllProjects);

projectsRoutes.post("/", createProject);

projectsRoutes.put("/:id", updateProject);
projectsRoutes.delete("/:id", deleteProject);
export { projectsRoutes };
