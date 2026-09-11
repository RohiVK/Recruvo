import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";
import path from "path";
import "dotenv/config";

let db = null;

let pgliteInstance;
try {
  const dbPath = path.resolve(process.cwd(), "hirely_pgdata");
  pgliteInstance = new PGlite(dbPath);
} catch (e) {
  pgliteInstance = new PGlite();
}

// Initialize embedded table schema
async function initEmbeddedTables(pglite) {
  try {
    if (pglite.waitReady) {
      await pglite.waitReady;
    }
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        resume JSONB NOT NULL
      );
    `);
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS job_descriptions (
        id SERIAL PRIMARY KEY,
        job_description JSONB NOT NULL
      );
    `);
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS screenings (
        id SERIAL PRIMARY KEY,
        resume_id INTEGER NOT NULL,
        jd_id INTEGER NOT NULL,
        score NUMERIC NOT NULL,
        reason TEXT NOT NULL,
        technical_score NUMERIC,
        experience_score NUMERIC,
        education_score NUMERIC,
        project_score NUMERIC,
        jd_match_score NUMERIC,
        matching_skills JSONB DEFAULT '[]'::jsonb,
        missing_skills JSONB DEFAULT '[]'::jsonb,
        strengths JSONB DEFAULT '[]'::jsonb,
        weaknesses JSONB DEFAULT '[]'::jsonb,
        summary TEXT,
        interview_questions JSONB DEFAULT '[]'::jsonb
      );
    `);
    try {
      await pglite.exec(`
        ALTER TABLE screenings ALTER COLUMN score TYPE NUMERIC;
        ALTER TABLE screenings ALTER COLUMN technical_score TYPE NUMERIC;
        ALTER TABLE screenings ALTER COLUMN experience_score TYPE NUMERIC;
        ALTER TABLE screenings ALTER COLUMN education_score TYPE NUMERIC;
        ALTER TABLE screenings ALTER COLUMN project_score TYPE NUMERIC;
        ALTER TABLE screenings ALTER COLUMN jd_match_score TYPE NUMERIC;
      `);
    } catch (migErr) {
      // Column type migration handled or already numeric
    }
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        rating INTEGER,
        type VARCHAR(50) DEFAULT 'feedback',
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Embedded PostgreSQL tables initialized successfully.");
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
    if (this.pglite.waitReady) {
      await this.pglite.waitReady;
    }
    const res = await this.pglite.query(text, params);
    return { rows: res.rows };
  }
}

db = new DbWrapper();

export default db;