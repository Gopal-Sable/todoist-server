import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../controllers/projectsController.js";

const projectsRoutes = Router();

projectsRoutes.get("/", getProjects);

projectsRoutes.get("/:id", getProjects);

projectsRoutes.post("/", createProject);

projectsRoutes.put("/:id", updateProject);
projectsRoutes.delete("/", deleteProject);
projectsRoutes.delete("/:id", deleteProject);
export { projectsRoutes };
