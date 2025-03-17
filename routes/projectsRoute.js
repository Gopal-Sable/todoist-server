import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../controllers/projectsController.js";

const projectsRoutes = Router();
// fetch all projects
projectsRoutes.get("/", getProjects);
// fetch project by id
projectsRoutes.get("/:id", getProjects);
// create a new project
projectsRoutes.post("/", createProject);
// update project by id
projectsRoutes.patch("/:id", updateProject);
// delete all projects
projectsRoutes.delete("/", deleteProject);
// delete project by id
projectsRoutes.delete("/:id", deleteProject);
export { projectsRoutes };
