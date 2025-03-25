import { Database } from "bun:sqlite";
import { rmSync, existsSync } from "fs";

// Nama file database
const DB_NAME = "dbBlog.sqlite";
const db = new Database(DB_NAME);
export function resetTables() {
  //mematikan foreign key
  db.exec("PRAGMA foreign_keys = OFF;");
  // Hapus data dari semua tabel
  db.exec("DELETE FROM blogs;");
  db.exec("DELETE FROM users;");
  db.exec("DELETE FROM categories;");

  // Reset auto-increment counter
  db.exec("DELETE FROM sqlite_sequence WHERE name='blogs';");
  db.exec("DELETE FROM sqlite_sequence WHERE name='users';");
  db.exec("DELETE FROM sqlite_sequence WHERE name='categories';");

  db.exec("PRAGMA foreign_keys = ON;"); // Aktifkan kembali foreign key
  db.exec("VACUUM;"); // Optimalkan database setelah penghapusan

  console.log("All tables have been reset.");
}

export function setupDatabase() {
  // kode untuk set foreign_key agar hidup
  db.exec("PRAGMA foreign_keys = ON;");

  // query untuk membuat tabel categories
  db.exec(`CREATE TABLE IF NOT EXISTS categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  // query untuk membuat tabel users
  db.exec(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        password VARCHAR(255) NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  // query untuk membuat tabel blogs
  db.exec(`CREATE TABLE IF NOT EXISTS blogs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryId INTEGER NOT NULL REFERENCES categories(id),
        userId INTEGER NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

export default db;
