import openDb from "../db/db.js";
import getFormattedTimestamp from "../middleware/getFormattedTimestamp.js";

const db = await openDb();

const Task = {
    async create(data) {
        const { content, description, due_date, project_id, user_id } = data;
        let checkProject_id = "SELECT id FROM projects WHERE user_id=?";
        let projectIds = await db.all(checkProject_id, [user_id]);
        let isProjectPresent = projectIds.map((proj) => proj.id);
        if (!isProjectPresent.includes(project_id)) {
            return { message: "Not your project" };
        }

        const sql = `INSERT INTO tasks (content, description, due_date, project_id) VALUES (?, ?, ?, ?)`;
        let result = await db.run(sql, [
            content,
            description,
            due_date,
            project_id,
        ]);
        if (result.changes > 0) {
            return {
                ...data,
                id: result.lastID,
                is_completed: 0,
                created_at: getFormattedTimestamp(),
            };
        }
        throw Error("Something went wrong");
    },

    async getAll({ page = 1, limit = 100, filters = {}, user_id }) {
        let queryParams = [];
        let conditions = [];

        let sql = `SELECT * FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE user_id = ?)`;
        let countQuery = `SELECT COUNT(*) as totalTask FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE user_id = ?)`;
        queryParams.push(user_id);
        if (filters.due_date) {
            conditions.push(`due_date LIKE ?`);
            queryParams.push(`%${filters.due_date}%`);
        }
        if (filters.is_completed !== undefined) {
            conditions.push(`is_completed = ?`);
            queryParams.push(filters.is_completed);
        }
        if (filters.created_at) {
            conditions.push(`created_at LIKE ?`);
            queryParams.push(`%${filters.created_at}%`);
        }

        if (conditions.length > 0) {
            sql += " AND " + conditions.join(" AND ");
            countQuery += " AND " + conditions.join(" AND ");
        }

        const count = await db.get(countQuery, queryParams);

        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, (page - 1) * limit);

        const tasks = await db.all(sql, queryParams);

        return {
            totalTasks: count.totalTask,
            currentPage: page,
            totalPages: Math.ceil(count.totalTask / limit),
            recordsPerPage: limit,
            tasks,
        };
    },
    async getById(id, user_id) {
        const sql = `SELECT * FROM tasks WHERE project_id=? AND project_id IN (SELECT id FROM projects WHERE user_id = ?)`;
        return await db.all(sql, [id, user_id]);
    },

    async update(id, fields, user_id) {
        const allowedFields = [
            "content",
            "description",
            "due_date",
            "is_completed",
        ];
        const updates = Object.keys(fields)
            .filter((key) => allowedFields.includes(key))
            .map((key) => `${key} = ?`);

        if (updates.length === 0) {
            return false;
        }

        const sql = `UPDATE tasks SET ${updates.join(
            ", "
        )} WHERE id = ? AND project_id IN (SELECT id FROM projects WHERE user_id = ?)`;
        const values = Object.values(fields).filter((_, index) =>
            allowedFields.includes(Object.keys(fields)[index])
        );
        values.push(id, user_id);

        const result = await db.run(sql, values);
        return result.changes > 0;
    },
    async delete(id, user_id) {
        if (!Number.isInteger(Number(id))) {
            return {
                message: "Invalid id",
            };
        }
        const sql = `DELETE FROM tasks WHERE id=? AND project_id IN (SELECT id FROM projects WHERE user_id = ?)`;
        return await db.run(sql, [id, user_id]);
    },
};

export default Task;
