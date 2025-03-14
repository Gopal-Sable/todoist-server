import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

export default async function openDb() {
    const db = await open({
        filename: "./db/TODOIST.db",
        driver: sqlite3.Database,
    });
    await db.run("PRAGMA foreign_keys = ON");
    return db;
}

// Creates tables if not exist
export async function createTable() {
    const projectsTable = `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL DEFAULT "White",
        is_favorite INTEGER DEFAULT 0
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
        await db.run(projectsTable);
        await db.run(tasksTable);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error.message);
    } finally {
        await db.close();
    }
}
