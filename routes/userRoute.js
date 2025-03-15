import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUsers,
    // updateUser,
} from "../controllers/usersController.js";

const usersRoute = Router();
// fetch all users
usersRoute.get("/", getUsers);
// fetch user by id
usersRoute.get("/:id", getUsers);
// Create user
usersRoute.post("/", createUser);
// // update user by id
// usersRoute.put("/:id", updateUser);
// delete user by id
usersRoute.delete("/:id", deleteUser);
export { usersRoute };
