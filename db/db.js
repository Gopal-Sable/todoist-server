import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

export default async function openDb() {
    const db = await open({
        filename: "./db/TODOIST.db",
        driver: sqlite3.Database,
    });

    await db.exec("PRAGMA journal_mode=WAL;");
    await db.run("PRAGMA foreign_keys = ON");
    return db;
}

// Creates tables if not exist
export async function createTable() {
    const userTable = `
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL, 
            email VARCHAR(255) UNIQUE,
            password varchar(255) NOT NULL
        )
    `;

    const comments = `
        CREATE TABLE IF NOT EXISTS comments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content VARCHAR(255) NOT NULL,
            posted_at TEXT DEFAULT CURRENT_TIMESTAMP,
            project_id int,
            task_id int,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        )
    `;

    const projectsTable = `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL DEFAULT "White",
        is_favorite INTEGER DEFAULT 0,
        user_id int, 
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE 
    )`;

    const tasksTable = `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        due_date TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`;

    const db = await openDb();
    try {
        await db.run(userTable);
        await db.run(projectsTable);
        await db.run(tasksTable);
        await db.run(comments);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error.message);
    } finally {
        await db.close();
    }
}

await createTable();
