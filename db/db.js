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
            email VARCHAR(255) UNIQUE
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
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error.message);
    } finally {
        await db.close();
    }
}

await createTable();
const BATCH_SIZE = 5000;

async function createUser(numOfUsers) {
    const db = await openDb();

    await db.run("PRAGMA journal_mode = WAL;");
    await db.run("PRAGMA synchronous = OFF;");

    let startTime = performance.now(); // Start timer

    try {
        await db.run("BEGIN TRANSACTION");

        for (let i = 0; i < numOfUsers; i += BATCH_SIZE) {
            let values = [];
            let placeholders = [];

            for (let j = 0; j < BATCH_SIZE && i + j < numOfUsers; j++) {
                let name = `user${i + j + 1}`;
                let email = `abc${i + j + 1}@mail.com`;
                values.push(name, email);
                placeholders.push("(?, ?)");
            }

            let query = `INSERT INTO users(name, email) VALUES ${placeholders.join(
                ", "
            )}`;
            await db.run(query, values);
            console.log(`Inserted ${i + BATCH_SIZE} records...`);
        }

        await db.run("COMMIT");
    } catch (error) {
        console.error("Insert Error:", error);
        await db.run("ROLLBACK");
    } finally {
        await db.close();
    }

    let endTime = performance.now();
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
}

async function createProject(numOfProjects) {
    const db = await openDb();

    await db.run("PRAGMA journal_mode = WAL;");
    await db.run("PRAGMA synchronous = OFF;");

    let startTime = performance.now();
    try {
        await db.run("BEGIN TRANSACTION");
        const colors = [
            "Red",
            "Green",
            "Blue",
            "Pink",
            "Purple",
            "Cyan",
            "Yellow",
            "Orange",
            "Teal",
            "Violet",
            "Crimson",
            "Lime",
            "Olive",
            "Navy",
            "Gold",
        ];

        for (let i = 0; i < numOfProjects; i += BATCH_SIZE) {
            let values = [];
            let placeholders = [];
            // name, color, is_favorite,
            for (let j = 0; j < BATCH_SIZE && i + j < numOfProjects; j++) {
                let name = `user${i + j + 1}`;
                let color = colors[Math.floor(Math.random() * colors.length)];
                let is_favorite = (i + j + 1) % 2 == 0;
                let user_id = Math.floor(Math.random() * 1000 + 1);
                values.push(name, color, is_favorite, user_id);
                placeholders.push("(?, ?, ?, ?)");
            }

            let query = `INSERT INTO projects(name, color,is_favorite,user_id) VALUES ${placeholders.join(
                ", "
            )}`;
            await db.run(query, values);
            console.log(`Inserted ${i + BATCH_SIZE} records...`);
        }

        await db.run("COMMIT");
    } catch (error) {
        console.error("Insert Error:", error);
        await db.run("ROLLBACK");
    } finally {
        await db.close();
    }

    let endTime = performance.now();
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
}
// Call function
// await createUser(1000);
// console.log("wait for 1 sec");

// setTimeout(async ()=>{
// await createProject(1000000);
// },1000);

async function createTasks(numOfTasks) {
    const db = await openDb();

    await db.run("PRAGMA journal_mode = WAL;");
    await db.run("PRAGMA synchronous = OFF;");

    let startTime = performance.now();
    try {
        await db.run("BEGIN TRANSACTION");
        for (let i = 0; i < numOfTasks; i += BATCH_SIZE) {
            let values = [];
            let placeholders = [];
            for (let j = 0; j < BATCH_SIZE && i + j < numOfTasks; j++) {
                let content = `content ${i + j + 1}`;
                let description = `description ${i + j + 1}`;
                let month = Math.floor(Math.random() * 12 + 1);
                let date =
                    month === 2
                        ? Math.floor(Math.random() * 28 + 1)
                        : Math.floor(Math.random() * 30 + 1);
                let due_date = `2025-${(month + "").padStart(2, "0")}-${(
                    date + ""
                ).padStart(2, "0")}`;
                let is_completed = (i + j + 1) % 2 == 0;
                let project_id = Math.floor(Math.random() * 1000000 + 1);
                values.push(
                    content,
                    description,
                    due_date,
                    is_completed,
                    project_id
                );
                placeholders.push("(?, ?, ?, ?, ?)");
            }

            let query = `INSERT INTO tasks(content, description, due_date, is_completed, project_id) VALUES ${placeholders.join(
                ", "
            )}`;
            await db.run(query, values);
            console.log(`Inserted ${i + BATCH_SIZE} records...`);
        }

        await db.run("COMMIT");
    } catch (error) {
        console.error("Insert Error:", error);
        await db.run("ROLLBACK");
    } finally {
        await db.close();
    }

    let endTime = performance.now();
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
}
// createTasks(10000000)
