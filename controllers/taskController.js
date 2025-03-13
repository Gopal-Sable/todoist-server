import openDb from "../db/db.js";
const db = await openDb();

const createTask = (req, res) => {
    const { content, description, due_date, project_id } = req.body;
    // handle foregn key if not present later
    if ((!content || !description, !due_date, !project_id)) {
        return res.status(400).json({ message: "Provide inputs" });
    }
    let sql =
        "INSERT INTO tasks(content, description, due_date, project_id) values(?,?,?,?)";
    db.run(sql, [content, description, due_date, project_id])
        .then((task) => res.json(task))
        .catch((err) => res.json(err));
};

const getTasks = (req, res) => {
    let sql = "SELECT * FROM tasks";
    if (req.params.id) {
        sql += " WHERE id=?";
    }
    db.all(sql, [req.params.id])
        .then((tasks) => res.json(tasks))
        .catch((err) => res.json({ error: err }));
};

const updateTask = (req, res) => {
    const { content, description, due_date, is_completed, created_at } =
        req.body;
    let id = req.params.id;
    if ((!content || !description, !due_date, !is_completed, !created_at)) {
        return res.status(400).json({ message: "Provide inputs" });
    }
    let sql =
        "UPDATE tasks SET content = ?, description = ?, due_date = ?, is_completed = ?, created_at = ? WHERE id = ? ";
    db.run(sql, [content, description, due_date, is_completed, created_at, id])
        .then((task) => res.send(task))
        .catch((err) => res.send(err));
};

const deleteTask = (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ message: "Provide valid id" });
    }
    let sql = "DELETE FROM tasks WHERE id=?";
    db.run(sql, [id])
        .then((task) => res.json(task))
        .catch((err) => res.send(err));
};

export { createTask, getTasks, updateTask,deleteTask };
