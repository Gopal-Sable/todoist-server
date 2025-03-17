import openDb from "../db/db.js";

const db = await openDb();

const ProjectModel = {
    async createProject({ name, color, is_favorite = false }) {
        const sql =
            "INSERT INTO projects (name, color, is_favorite) VALUES (?, ?, ?)";
        return await db.run(sql, [name, color, is_favorite]);
    },

    async getProjects({ id, page = 1, limit = 100 }) {
        if (!Number.isInteger(page) || page < 1) page = 1;
        if (!Number.isInteger(limit) || limit < 1 || limit > 10000) limit = 100;

        let sql = "SELECT * FROM projects";
        let rowCountQuery = "SELECT COUNT(*) as rowCount FROM projects";
        let params = [];

        if (id) {
            if (!Number.isInteger(Number(id)))
                throw new Error("Invalid project ID");
            sql += " WHERE id = ?";
            params.push(id);
            return await db.get(sql, params);
        }

        // Use parameterized queries for pagination
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, (page - 1) * limit);

        const rowCount = await db.get(rowCountQuery);
        const projects = await db.all(sql, params);

        return {
            totalRecord: rowCount.rowCount,
            currPage: page,
            recordsPerPage: limit,
            pages: Math.ceil(rowCount.rowCount / limit),
            projects,
        };
    },
    async updateProject(id, { name, color, is_favorite }) {
        const sql =
            "UPDATE projects SET name=?, color=?, is_favorite=? WHERE id=?";
        const result = await db.run(sql, [name, color, is_favorite, id]);
        return result.changes > 0;
    },

    async deleteProject(id = null) {
        let sql = "DELETE FROM projects";
        let params = [];

        if (id) {
            if (isNaN(id)) throw new Error("Invalid project ID");
            sql += " WHERE id=?";
            params.push(id);
        }

        const result = await db.run(sql, params);
        return result.changes > 0;
    },
};

export default ProjectModel;
