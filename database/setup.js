const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  try {
    // Koneksi tanpa database dulu
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    console.log("Connected to MySQL");

    // Baca dan jalankan schema.sql
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await connection.query(schema);
    console.log("✓ Schema created successfully");

    // Baca dan jalankan seed.sql
    const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");
    await connection.query(seed);
    console.log("✓ Seed data inserted successfully");

    await connection.end();
    console.log("\n✓ Database setup completed!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
