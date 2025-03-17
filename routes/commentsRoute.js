import { Router } from "express";
import {
    createComment,
    deleteComment,
    getAllComments,
} from "../controllers/commentsController.js";

const commentRoute = Router();
// add a comment
commentRoute.post("/", createComment);
commentRoute.get("/", getAllComments);
commentRoute.get("/:id", getAllComments);
commentRoute.delete("/:id", deleteComment);
export { commentRoute };
