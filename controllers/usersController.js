import openDb from "../db/db.js";

const db = await openDb();
// Users created
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!name || !email || !regex.test(email)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let sql = `INSERT INTO users (name,email) VALUES (?, ?)`;
        const result = await db.run(sql, [name, email]);

        return res.status(201).json({
            message: "User created successfully",
            result,
        });
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Server error" });
    }
};

//  Get all users or by id
const getUsers = async (req, res) => {
    let reqArr = [];
    let sql = "SELECT * FROM users";
    let countQuery = "SELECT COUNT(*) as totalUser FROM users";
    let limit = Number(req.query.limit) || 100;
    let page = Number(req.query.page) || 1;

    if (!Number.isInteger(page) || page < 1) {
        page = 1;
    }
    if (!Number.isInteger(limit) || limit > 10000 || limit < 1) {
        limit = 100;
    }

    if (req.params.id) {
        if (isNaN(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        sql += " WHERE id = ?";
        countQuery += " WHERE id = ?";
        reqArr.push(req.params.id);
    }

    // Create a separate array for countQuery to avoid excess parameters
    let countParams = [...reqArr];

    sql += " LIMIT ? OFFSET ?";
    reqArr.push(limit, (page - 1) * limit);

    try {
        const tasks = await db.all(sql, reqArr);
        const count = await db.get(countQuery, countParams); // Use countParams here

        if (req.params.id && tasks.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            totalUsers: count ? count.totalUser : 0,
            currentPage: page,
            totalPages: Math.ceil((count ? count.totalUser : 0) / limit),
            recordsPerPage: limit,
            tasks,
        });
    } catch (err) {
        return res
            .status(500)
            .json({ error: "Server error", details: err.message });
    }
};

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
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        let sql = "DELETE FROM users WHERE id=?";
        const result = await db.run(sql, [id]);

        if (result.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

export {
    createUser,
    getUsers,
    //updateUser,
    deleteUser,
};
