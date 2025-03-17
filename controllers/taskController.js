import Task from "../models/taskModel.js";

const createTask = async (req, res) => {
    try {
        const { content, description, due_date, project_id } = req.body;
        if (!content || !description || !due_date || !project_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await Task.create({ content, description, due_date, project_id });
        return res.status(201).json({ message: "Task created successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

const getTasks = async (req, res) => {
    try {
        if (req.params.id) {
            const task = await Task.getById(req.params.id);
            if (!task)
                return res.status(404).json({ message: "Task not found" });
            return res.status(200).json(task);
        }

        const tasks = await Task.getAll({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 100,
            filters: req.query,
        });
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const result = await Task.update(req.params.id, req.body);
        if (!result) {
            return res
                .status(404)
                .json({
                    message: "Task not found or no valid fields provided",
                });
        }

        return res.json({ message: "Task updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const result = await Task.delete(req.params.id);
        if (result.changes === 0)
            return res.status(404).json({ message: "Task not found" });

        return res.json({ message: "Task deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

export { createTask, getTasks, updateTask, deleteTask };
