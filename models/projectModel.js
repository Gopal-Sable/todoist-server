import openDb from "../db/db.js";

const db = await openDb();

const ProjectModel = {
    async createProject(data) {
        const { name, color, user_id, is_favorite = false } = data;
        const sql =
            "INSERT INTO projects (name, color, is_favorite,user_id) VALUES (?, ?, ?, ?)";
        const result = await db.run(sql, [name, color, is_favorite, user_id]);
        result["data"] = { id: result.lastID, ...data };
        return result.data;
    },

    async getProjects({ user_id, id, page = 1, limit = 100 }) {
        if (!Number.isInteger(page) || page < 1) page = 1;
        if (!Number.isInteger(limit) || limit < 1 || limit > 10000) limit = 100;

        let sql = "SELECT * FROM projects WHERE user_id= ?";
        let rowCountQuery =
            "SELECT COUNT(*) as rowCount FROM projects WHERE user_id= ?";
        let params = [user_id];

        if (id) {
            if (!Number.isInteger(Number(id)))
                throw new Error("Invalid project ID");
            sql += " AND id = ?";
            params.push(id);
            return await db.get(sql, params);
        }

        // Use parameterized queries for pagination
        const rowCount = await db.get(rowCountQuery, params);
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, (page - 1) * limit);

        const projects = await db.all(sql, params);

        return {
            totalRecord: rowCount.rowCount,
            currPage: page,
            recordsPerPage: limit,
            pages: Math.ceil(rowCount.rowCount / limit),
            projects,
        };
    },
    async updateProject(id, fields, user_id) {
        const allowedFields = ["name", "color", "is_favorite"];
        const updates = Object.keys(fields)
            .filter((key) => allowedFields.includes(key))
            .map((key) => `${key} = ?`);

        if (updates.length === 0) {
            return false;
        }

        const sql = `UPDATE projects SET ${updates.join(
            ", "
        )} WHERE id = ? AND user_id = ?`;
        const values = Object.values(fields).filter((_, index) =>
            allowedFields.includes(Object.keys(fields)[index])
        );
        values.push(id, user_id);

        const result = await db.run(sql, values);
        return result.changes > 0;
    },
    async deleteProject({ id = null, user_id }) {
        try {
            const project = await db.get(
                `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
                [id, user_id]
            );

            if (!project) {
                return { notFound: true };
            }

            // Respond immediately
            deleteProjectDataInBackground(id); // Fire and forget

            return { message: "Deleted" };
        } catch (error) {
            throw error;
        }
    },
};

async function deleteProjectDataInBackground(projectId) {
    const dbDelete = await openDb();
    try {
        await dbDelete.run("BEGIN TRANSACTION");

        await dbDelete.run(`DELETE FROM projects WHERE id = ?`, [projectId]);

        await dbDelete.run("COMMIT");
        console.log(
            `Project ${projectId} and related data deleted in background`
        );
    } catch (error) {
        await dbDelete.run("ROLLBACK");
        console.error(
            `Error during background cleanup of project ${projectId}:`,
            error
        );
    } finally {
        dbDelete.close();
    }
}

export default ProjectModel;
