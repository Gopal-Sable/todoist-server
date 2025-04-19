import openDb, { createTable } from "./db.js";
import bcrypt from "bcrypt";
const BATCH_SIZE = 5000;
createTable();
async function createUser(numOfUsers) {
    const db = await openDb();

    // await db.run("PRAGMA journal_mode = WAL;");
    // await db.run("PRAGMA synchronous = OFF;");

    let startTime = performance.now();

    try {
        await db.run("BEGIN TRANSACTION");

        for (let i = 0; i < numOfUsers; i += BATCH_SIZE) {
            let values = [];
            let placeholders = [];

            for (let j = 0; j < BATCH_SIZE && i + j < numOfUsers; j++) {
                let name = `user${i + j + 1}`;
                let email = `abc${i + j + 1}@mail.com`;
                let password = await bcrypt.hash(`abcd${i + j + 1}`, 10);
                values.push(name, email, password);
                placeholders.push("(?, ?, ?)");
            }

            let query = `INSERT INTO users(name, email, password) VALUES ${placeholders.join(
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
            "#F87171",
            "#34D399",
            "#60A5FA",
            "#F472B6",
            "#A78BFA",
            "#22D3EE",
            "#FACC15",
            "#FB923C",
            "#2DD4BF",
            "#C084FC",
            "#EF4444",
            "#84CC16",
            "#A3E635",
            "#3B82F6",
            "#FBBF24",
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
await createUser(1000);
// console.log("wait for 1 sec");

// setTimeout(async ()=>{
await createProject(1000000);
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
createTasks(10000000);
