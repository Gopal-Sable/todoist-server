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
        return res
            .status(200)
            .json({ message: "Project created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// get all project or specified id
const getProjects = async (req, res, next) => {
    try {
        let page = req.query.page;
        let limit = 10000;
        if (Number.isInteger(page) || page < 0) {
            page = 0;
        }
        let sql = "SELECT * FROM projects";
        let rowCount= "SELCT COUNT(*) FROM projects"
        if (req.params.id) {
            if (isNaN(req.params.id)) {
                return res.status(400).json({ message: "Invalid task ID" });
            }
            sql += " WHERE id=?";
            rowCount +=" WHERE id=?"
        }
        sql += ` limit ${limit} offset ${page * limit || 0}`;
        const projects = await db.all(sql, [req.params.id]);
        if (req.params.id && projects.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({
            length: projects.length,
            currPage: page,
            pages: Math.ceil(projects.length / limit),
            projects,
        });
    } catch (error) {
        res.status(500).json(error);
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
        return res
            .status(200)
            .json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// delete all project or by id
const deleteProject = async (req, res, next) => {
    try {
        const id = req.params.id;
        let sql = "DELETE FROM projects";
        if (id) {
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid task ID" });
            }
            sql += " WHERE id=?";
        }
        const project = await db.run(sql, [id]);
        if (project.changes === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project deleted succefully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { createProject, getProjects, updateProject, deleteProject };
