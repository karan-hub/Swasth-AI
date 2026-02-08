import db from '../db.js';

async function migrate() {
    try {
        console.log("Starting migration: Add firstName and lastName to user_profiles table...");

        const [rows] = await db.query("SHOW COLUMNS FROM user_profiles LIKE 'first_name'");
        if (rows.length > 0) {
            console.log("Column 'first_name' already exists. Skipping.");
        } else {
            await db.query("ALTER TABLE user_profiles ADD COLUMN first_name VARCHAR(255) AFTER id");
            console.log("Added 'first_name' column.");
        }

        const [rows2] = await db.query("SHOW COLUMNS FROM user_profiles LIKE 'last_name'");
        if (rows2.length > 0) {
            console.log("Column 'last_name' already exists. Skipping.");
        } else {
            await db.query("ALTER TABLE user_profiles ADD COLUMN last_name VARCHAR(255) AFTER first_name");
            console.log("Added 'last_name' column.");
        }

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
