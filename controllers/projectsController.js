import openDb from "../db/db.js";
const db = await openDb();

// Create project
const createProject = async (req, res, next) => {
    try {
        const { name, color } = req.body;
        if (!name || !color) {
            return res.status(400).json({ message: "Provide inputs" });
        }

        let sql =
            "INSERT INTO projects (name, color, is_favorite) values (?,?,?)";
        const project = await db.run(sql, [
            name,
            color,
            req.body.is_favorite || false,
        ]);
        return res.json(project);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// get all project or specified id
const getProjects = async (req, res, next) => {
    try {
        let sql = "SELECT * FROM projects";
        if (req.params.id) {
            if (isNaN(req.params.id)) {
                return res.status(400).json({ message: "Invalid task ID" });
            }
            sql += " WHERE id=?";
        }
        const projects = await db.all(sql, [req.params.id]);
        if (req.params.id && projects.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.json(projects);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// update project by id
const updateProject = async (req, res, next) => {
    try {
        const { name, color, is_favorite } = req.body;
        const id = req.params.id;
        if (!name || !color || is_favorite == null) {
            return res.status(400).json({ message: "Provide inputs" });
        }
        let sql =
            "UPDATE projects SET name=?, color=?, is_favorite=? WHERE id=?";

        const project = await db.run(sql, [name, color, is_favorite, id]);
        if (project.changes === 0) {
            return res.status(400).json({ message: "Id not found" });
        }
        return res.json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// delete all project or by id
const deleteProject = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid id" });
        }
        let sqlProject = "DELETE FROM projects";
        if (req.params.id) {
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid task ID" });
            }
            sql += " WHERE id=?";
        }
        const project = await db.run(sqlProject, [id]);
        if (project.changes === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted succefully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { createProject, getProjects, updateProject, deleteProject };
