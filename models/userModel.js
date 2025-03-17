import jwt from "jsonwebtoken";
import openDb from "../db/db.js";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
configDotenv();
const JWT_SECRETE = process.env.JWT_SECRETEKEY;
const db = await openDb();

const User = {
    async login({ email, password }) {
        let sql = "select id, name, password from users where email = ?";
        const user = await db.get(sql, [email]);
        if (user === null) {
            return { message: "Email not exist" };
        }
        let match = await bcrypt.compare(password, user.password);
        if (match) {
            return { token: jwt.sign(user, JWT_SECRETE) };
        } else {
            return { message: "Invalid Credentials" };
        }
    },
    async createUser({ name, email }) {
        let sql = `INSERT INTO users (name,email) VALUES (?, ?)`;
        const result = await db.run(sql, [name, email]);
        return result;
    },

    //  Get all users or by id
    async getUsers({ limit, page }) {
        let reqArr = [];
        let sql = "SELECT id, name, email FROM users";
        let countQuery = "SELECT COUNT(*) as totalUser FROM users";
        limit = Number(limit) || 100;
        page = Number(page) || 1;

        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }
        if (!Number.isInteger(limit) || limit > 10000 || limit < 1) {
            limit = 100;
        }
        const count = await db.get(countQuery, reqArr);

        sql += " LIMIT ? OFFSET ?";
        reqArr.push(limit, (page - 1) * limit);
        const tasks = await db.all(sql, reqArr);

        return {
            totalUsers: count ? count.totalUser : 0,
            currentPage: page,
            totalPages: Math.ceil((count ? count.totalUser : 0) / limit),
            recordsPerPage: limit,
            tasks,
        };
    },
    async getUsersById(id) {
        if (Number.isInteger(Number(id))) {
            let sql = "SELECT * FROM users WHERE id = ?";
            return await db.get(sql, [id]);
        } else {
            return { message: "Invalid id" };
        }
    },

    // Update Task by id
    // const updateTask = async (req, res) => {
    //     try {
    //         const { content, description, due_date, is_completed } = req.body;
    //         const id = req.params.id;

    //         if (
    //             !content ||
    //             !description ||
    //             !due_date ||
    //             is_completed === undefined
    //         ) {
    //             return res.status(400).json({ message: "All fields are required" });
    //         }

    //         if (isNaN(id)) {
    //             return res.status(400).json({ message: "Invalid task ID" });
    //         }

    //         let sql = `UPDATE tasks SET content = ?, description = ?, due_date = ?, is_completed = ? WHERE id = ?`;
    //         const result = await db.run(sql, [
    //             content,
    //             description,
    //             due_date,
    //             is_completed,
    //             id,
    //         ]);

    //         if (result.changes === 0) {
    //             return res.status(404).json({ message: "Task not found" });
    //         }

    //         return res.json({ message: "Task updated successfully" });
    //     } catch (err) {
    //         return res.status(500).json({ error: "Server error" });
    //     }
    // };

    // // Delete user by id
    async deleteUser(id) {
        let sql = "DELETE FROM users WHERE id=?";
        return await db.run(sql, [id]);
    },
};

export default User;
