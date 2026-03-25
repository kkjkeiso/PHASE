import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";

const db: DatabaseType = new Database(path.resolve(__dirname, "../../database.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT UNIQUE NOT NULL,
                                     email TEXT UNIQUE NOT NULL,
                                     password_hash TEXT NOT NULL,
                                     created_at TEXT DEFAULT (datetime('now'))
    )
`);

export default db;