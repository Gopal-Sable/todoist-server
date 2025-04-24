import jwt from "jsonwebtoken";
import openDb from "../db/db.js";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
configDotenv();
const JWT_SECRETE = process.env.JWT_SECRETEKEY;
const db = await openDb();

const User = {
    async login({ email, password }) {
        const sql = "SELECT id, name, password FROM users WHERE email = ?";
        const user = await db.get(sql, [email]);

        if (!user) {
            return { success: false, message: "Email does not exist" };
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return { success: false, message: "Invalid credentials" };
        }

        // Never include password in the token
        const { password: _, ...userPayload } = user;

        const token = jwt.sign(userPayload, JWT_SECRETE, {
            expiresIn: "1h", // Optional: token expiry
        });

        return {
            success: true,
            message: "Login successful",
            token,
            user: userPayload, // Optional: return non-sensitive user info
        };
    },
    async createUser({ name, email, password }) {
        let sql = `INSERT INTO users (name,email,password) VALUES (?, ?, ?)`;
        const result = await db.run(sql, [name, email, password]);
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
            let sql = "SELECT id,name,email FROM users WHERE id = ?";
            return await db.get(sql, [id]);
        } else {
            return { message: "Invalid id" };
        }
    },

    // Update Task by id
    async update(id, fields) {
        const allowedFields = ["name", "email"];
        const updates = Object.keys(fields)
            .filter((key) => allowedFields.includes(key))
            .map((key) => `${key} = ?`);

        if (updates.length === 0) {
            return false;
        }

        const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
        const values = Object.values(fields).filter((_, index) =>
            allowedFields.includes(Object.keys(fields)[index])
        );
        values.push(id);

        const result = await db.run(sql, values);
        return result.changes > 0;
    },

    // // Delete user by id
    async deleteUser(id) {
        try {
            const user = await db.get(`SELECT * FROM users WHERE id = ? AND is_deleted = 0`, [id]);
            console.log(user);

            if (!user) {
                return { message: "User not found or already deleted" };
            }
            await db.run(`UPDATE users SET is_deleted = 1 WHERE id = ?`, [id]);
            console.log("User marked as deleted.");

            deleteUserDataInBackground(id);

            return { message: "Deleted" };
        } catch (error) {
            console.error("Failed to mark user as deleted:", error);
            throw error;
        }
    },
};

async function deleteUserDataInBackground(id) {
    const dbDelete = await openDb();
    try {
        await dbDelete.run("BEGIN TRANSACTION");

        await dbDelete.run(`DELETE FROM users WHERE id = ?`, [id]);
        await dbDelete.run("COMMIT");
        console.log(`Background cleanup complete for user ${id}`);
    } catch (error) {
        await dbDelete.run("ROLLBACK");
        console.error(`Error in background cleanup for user ${id}:`, error);
    } finally {
        dbDelete.close();
    }
}

export default User;
