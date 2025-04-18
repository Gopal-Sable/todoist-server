import bcrypt from "bcrypt";
import User from "../models/userModel.js";
// Users created
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!name || !email || !regex.test(email) || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        let passwordHash = await bcrypt.hash(password, 10);
        let user = await User.createUser({
            name,
            email,
            password: passwordHash,
        });
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    let result = await User.login({ email, password });
    res.json(result);
};

//  Get all users or by id
const getUsers = async (req, res) => {
    let limit = Number(req.query.limit) || 100;
    let page = Number(req.query.page) || 1;
    let id = Number(req.params.id);

    if (id && !Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    try {
        if (id && Number.isInteger(id)) {
            let user = await User.getUsersById(id);
            if (user.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }

        const users = await User.getUsers({ limit, page, id });
        return res.status(200).json(users);
    } catch (err) {
        return res
            .status(500)
            .json({ error: "Server error", details: err.message });
    }
};

// // Delete user by id
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        let result = await User.deleteUser(id);
        if (result.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (Object.keys(req.body).length === 0) {
            return res
                .status(400)
                .json({ message: "No fields provided for update" });
        }

        const result = await User.update(id, req.body);

        if (!result) {
            return res
                .status(404)
                .json({
                    message: "User not found or no valid fields provided",
                });
        }

        return res.json({ message: "User updated successfully" });
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Server error" });
    }
};

export { createUser, getUsers, updateUser, deleteUser, login };
