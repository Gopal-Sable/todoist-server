import openDb from "../db/db.js";
const db = await openDb();

const createProject = (req, res, next) => {
    const { name, color } = req.body;
    if (!name || !color) {
        return res.status(400).json({ message: "Provide inputs" });
    }
    let sql = "INSERT INTO projects (name, color, is_favorite) values (?,?,?)";
    db.run(sql, [name, color, req.body.is_favorite || false])
        .then((project) => res.json(project))
        .catch((e) => res.json(e.message));
};

const getAllProjects = (req, res, next) => {
    let sql = "SELECT * FROM projects";
    db.all(sql)
        .then((project) => res.json(project))
        .catch((e) => res.json(e.message));
};

const updateProject = (req, res, next) => {
    const { name, color, is_favorite } = req.body;
    const id = req.params.id;
    if (!name || !color || is_favorite == null) {
        return res.status(400).json({ message: "Provide inputs" });
    }
    let sql = "UPDATE projects SET name=?, color=?, is_favorite=? WHERE id=?";
    db.run(sql, [name, color, is_favorite, id])
        .then((project) => res.json(project))
        .catch((e) => res.json(e.message));
};

const deleteProject = (req, res, next) => {
    const id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }
    let sql = "DELETE FROM projects WHERE id=?";
    db.run(sql, [id])
        .then((project) => res.json(project))
        .catch((e) => res.json(e.message));
};

export { createProject, getAllProjects, updateProject, deleteProject };
