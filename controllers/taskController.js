import openDb from "../db/db.js";

const db = await openDb();

const createTask = async (req, res) => {
    try {
        const { content, description, due_date, project_id } = req.body;

        if (!content || !description || !due_date || !project_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let sql = `INSERT INTO tasks (content, description, due_date, project_id) VALUES (?, ?, ?, ?)`;
        const result = await db.run(sql, [
            content,
            description,
            due_date,
            project_id,
        ]);
        return res.status(201).json({
            message: "Task created successfully",
        });
    } catch (err) {
        if (err.errno === 19) {
            return res.status(404).json({ error: "Project not present" });
        }
        return res.status(500).json({ error: "Server error" });
    }
};

//  Get all tasks or by id
const getTasks = async (req, res) => {
    let reqArr = [];
    let sql = "SELECT * FROM tasks";

    if (req.params.id) {
        if (isNaN(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        sql += " WHERE id=?";
        reqArr.push(req.params.id);
    }

    if (Object.keys(req.query).length != 0) {
        sql += " WHERE 1==1 ";
        if (req.query.due_date) {
            sql += "AND due_date like '%?%' ";
            reqArr.push(req.query.due_date);
        }
        if (req.query.is_completed) {
            sql += "AND is_completed = ? ";
            reqArr.push(req.query.is_completed);
        }
        if (req.query.created_at) {
            sql += "AND created_at like '%?%'";
            reqArr.push(req.query.created_at);
        }
    }
    try {
        const tasks = await db.all(sql, reqArr);
        if (req.params.id && tasks.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json(err, { error: "Server error" });
    }
};

// Update Task by id
const updateTask = async (req, res) => {
    try {
        const { content, description, due_date, is_completed } = req.body;
        const id = req.params.id;

        if (
            !content ||
            !description ||
            !due_date ||
            is_completed === undefined
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        let sql = `UPDATE tasks SET content = ?, description = ?, due_date = ?, is_completed = ? WHERE id = ?`;
        const result = await db.run(sql, [
            content,
            description,
            due_date,
            is_completed,
            id,
        ]);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json({ message: "Task updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Delete Task by id
const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        let sql = "DELETE FROM tasks WHERE id=?";
        const result = await db.run(sql, [id]);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json({ message: "Task deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

export { createTask, getTasks, updateTask, deleteTask };
