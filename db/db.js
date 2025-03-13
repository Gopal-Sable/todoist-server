import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

// Create a connection to the database
export default function openDb() {
    return open({
        filename: "./db/TODOIST.db",
        driver: sqlite3.Database,
    });
}

// Creates tables if not exist
export async function createTable() {
    let projectsTable = `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL DEFAULT "White",
        is_favorite BOOLEAN DEFAULT FALSE
    )`;

    let tasksTable = `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        due_date TEXT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`;

    try {
        const db = await openDb();
        await db.exec(projectsTable);
        await db.exec(tasksTable);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error.message);
    }
}
