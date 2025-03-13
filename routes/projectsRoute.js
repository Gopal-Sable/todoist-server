import { Router } from "express";
import {
    createProject,
    deleteProject,
    getAllProjects,
    updateProject,
} from "../controllers/projectsController.js";

const projectsRout = Router();

projectsRout.get("/", getAllProjects);

projectsRout.post("/", createProject);

projectsRout.put("/:id", updateProject);
projectsRout.delete("/:id", deleteProject);
export { projectsRout };
