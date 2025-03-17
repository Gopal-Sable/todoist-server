import openDb from "../db/db.js";

const db = await openDb();

const Task = {
    async create({ content, description, due_date, project_id }) {
        const sql = `INSERT INTO tasks (content, description, due_date, project_id) VALUES (?, ?, ?, ?)`;
        return await db.run(sql, [content, description, due_date, project_id]);
    },

    async getAll({ page = 1, limit = 100, filters = {} }) {
        let queryParams = [];
        let conditions = [];

        let sql = `SELECT * FROM tasks`;
        let countQuery = `SELECT COUNT(*) as totalTask FROM tasks`;

        if (filters.due_date) {
            conditions.push(`due_date LIKE ?`);
            queryParams.push(`%${filters.due_date}%`);
        }
        if (filters.is_completed !== undefined) {
            // Allow boolean false
            conditions.push(`is_completed = ?`);
            queryParams.push(filters.is_completed);
        }
        if (filters.created_at) {
            conditions.push(`created_at LIKE ?`);
            queryParams.push(`%${filters.created_at}%`);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(" AND ");
            countQuery += ` WHERE ` + conditions.join(" AND ");
        }

        const count = await db.get(countQuery, queryParams);

        // Apply pagination
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
    async getById(id) {
        const sql = `SELECT * FROM tasks WHERE id=?`;
        return await db.get(sql, [id]);
    },

    async update(id, { content, description, due_date, is_completed }) {
        const sql = `UPDATE tasks SET content=?, description=?, due_date=?, is_completed=? WHERE id=?`;
        return await db.run(sql, [
            content,
            description,
            due_date,
            is_completed,
            id,
        ]);
    },

    async delete(id) {
        const sql = `DELETE FROM tasks WHERE id=?`;
        return await db.run(sql, [id]);
    },
};

export default Task;
