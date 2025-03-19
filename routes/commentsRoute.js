import { Router } from "express";
import {
    createComment,
    deleteComment,
    getAllComments,
    updateComment,
} from "../controllers/commentsController.js";
import authHandler from "../middleware/authToken.js";

const commentRoute = Router();
// add a comment
commentRoute.post("/", createComment);
commentRoute.get("/", getAllComments);
commentRoute.get("/:id", getAllComments);
commentRoute.delete("/:id", authHandler, deleteComment);
commentRoute.patch("/:id", authHandler, updateComment);
export { commentRoute };
