import openDb from "../db/db.js";

const db = await openDb();

const CommentModel = {
    async createComment({ content, project_id, task_id }) {
        const sql =
            "INSERT INTO comments(content, project_id, task_id) VALUES (?, ?, ?)";
        return await db.run(sql, [content, project_id, task_id]);
    },

    async getComments({ id, page = 1, limit = 100 }) {
        if (!Number.isInteger(page) || page < 1) page = 1;
        if (!Number.isInteger(limit) || limit < 1 || limit > 10000) limit = 100;

        let sql = "SELECT * FROM comments";
        let rowCountQuery = "SELECT COUNT(*) as rowCount FROM comments";
        let params = [];

        if (id) {
            if (!Number.isInteger(Number(id))) {
                throw new Error("Invalid comment ID");
            } else {
                sql += " WHERE id = ?";
                params.push(id);
                return await db.get(sql, params);
            }
        }

        // Use parameterized queries for pagination
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, (page - 1) * limit);

        const rowCount = await db.get(rowCountQuery);
        const comments = await db.all(sql, params);

        return {
            totalRecord: rowCount.rowCount,
            currPage: page,
            recordsPerPage: limit,
            pages: Math.ceil(rowCount.rowCount / limit),
            comments,
        };
    },
    // async updateComment(id, { name, color, is_favorite }) {
    //     const sql =
    //         "UPDATE comments SET name=?, color=?, is_favorite=? WHERE id=?";
    //     const result = await db.run(sql, [name, color, is_favorite, id]);
    //     return result.changes > 0;
    // },

    async deleteComment(id = null) {
        let sql = "DELETE FROM comments";
        let params = [];

        if (id) {
            if (isNaN(id)) throw new Error("Invalid comment ID");
            sql += " WHERE id=?";
            params.push(id);
        }

        const result = await db.run(sql, params);
        return result.changes > 0;
    },
};

export default CommentModel;
