import { Router } from "express";
import {
    createComment,
    deleteComment,
    getAllComments,
    updateComment,
} from "../controllers/commentsController.js";

const commentRoute = Router();
// add a comment
commentRoute.post("/", createComment);
commentRoute.get("/", getAllComments);
commentRoute.get("/:id", getAllComments);
commentRoute.delete("/:id", deleteComment);
commentRoute.patch("/:id", updateComment);
export { commentRoute };
