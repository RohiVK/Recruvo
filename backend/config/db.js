import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";
import path from "path";
import "dotenv/config";

let db = null;

const dbPath = path.resolve(process.cwd(), "hirely_pgdata");
const pgliteInstance = new PGlite(dbPath);

// Initialize embedded table schema
async function initEmbeddedTables(pglite) {
  try {
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        resume JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS job_descriptions (
        id SERIAL PRIMARY KEY,
        job_description JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS screenings (
        id SERIAL PRIMARY KEY,
        resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
        jd_id INTEGER NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
        score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
        reason TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.error("Embedded DB table init error:", err.message);
  }
}

// Wrapper to expose unified db.query(sql, params) interface
class DbWrapper {
  constructor() {
    this.pool = null;
    this.pglite = pgliteInstance;
    this.usePglite = true;

    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("@")) {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          connectionTimeoutMillis: 3000,
        });
        this.usePglite = false;
      } catch (e) {
        this.usePglite = true;
      }
    }

    if (this.usePglite) {
      initEmbeddedTables(this.pglite);
    }
  }

  async query(text, params = []) {
    if (!this.usePglite && this.pool) {
      try {
        return await this.pool.query(text, params);
      } catch (err) {
        // Fallback to embedded PGlite on network connection failure
        if (err.code === "ECONNREFUSED" || err.message.includes("connect")) {
          console.warn("External DB unavailable. Falling back to embedded local PostgreSQL engine.");
          this.usePglite = true;
          await initEmbeddedTables(this.pglite);
          return await this.query(text, params);
        }
        throw err;
      }
    }

    // Use embedded PGlite
    const res = await this.pglite.query(text, params);
    return { rows: res.rows };
  }
}

db = new DbWrapper();

export default db;