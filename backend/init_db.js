import mysql from 'mysql2/promise';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
    });

    console.log("Connected to MySQL server.");

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`swasth-ai\``);
        console.log("Database 'swasth-ai' created or exists.");

        await connection.changeUser({ database: 'swasth-ai' });
        console.log("Switched to 'swasth-ai'.");


        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_profiles(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            age INT,
            gender VARCHAR(50),
            height FLOAT,
            weight FLOAT,
            prakriti JSON,
            vikriti JSON,
            agni JSON,
            ahara JSON,
            dinacharya JSON,
            lifestyle JSON,
            medical JSON,
            dominant_prakriti VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
            `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS chat_sessions(
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
            )
            `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS chat_messages(
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id INT,
                role ENUM('user', 'assistant'),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
            )
            `);

        console.log("Tables 'user_profiles', 'chat_sessions', 'chat_messages' ready.");

    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        await connection.end();
    }
}

initDB();
