import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUsers,
    login,
    updateUser,
} from "../controllers/usersController.js";
import authToken from "../middleware/authToken.js";

const usersRoute = Router();
// fetch all users
usersRoute.get("/", getUsers);
usersRoute.post("/login", login);

// fetch user by id
usersRoute.get("/:id", getUsers);
// Create user
usersRoute.post("/", createUser);
// // update user by id
usersRoute.patch("/:id", updateUser);
// delete user by id
usersRoute.delete("/:id", deleteUser);
export { usersRoute };
