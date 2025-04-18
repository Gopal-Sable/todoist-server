import openDb from "../db/db.js";
import getFormattedTimestamp from "../middleware/getFormattedTimestamp.js";

const db = await openDb();

const CommentModel = {
    async createComment(data) {
        const { content, project_id, task_id } = data;
        const sql =
            "INSERT INTO comments(content, project_id, task_id) VALUES (?, ?, ?)";
        const results = await db.run(sql, [content, project_id, task_id]);
        return {
            ...data,
            id: results.lastID,
            posted_at: getFormattedTimestamp(),
        };
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

    async deleteComment(id) {
        if (!Number.isInteger(Number(id)))
            throw new Error("Invalid comment ID");

        let sql = "DELETE FROM comments WHERE id=?";

        const result = await db.run(sql, [id]);        
        return result;
    },
    async updateComment(id, { content }) {
        if (!content) return false;

        const sql = `UPDATE comments SET content = ? WHERE id = ?`;
        const result = await db.run(sql, [content, id]);

        return result.changes > 0;
    },
};

export default CommentModel;
