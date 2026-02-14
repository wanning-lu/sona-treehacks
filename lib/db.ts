import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Initialize Neon serverless driver
const sql = neon(process.env.DATABASE_URL);

export async function createTables() {
  // Create sessions table for storing conversation sessions
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      conversation_id TEXT NOT NULL,
      personality JSONB,
      scenario TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Create transcripts table for storing conversation messages (cached from OpenAI)
  await sql`
    CREATE TABLE IF NOT EXISTS transcripts (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES sessions(id),
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `;

  // Create feedback table for storing analysis and feedback
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES sessions(id),
      analysis TEXT,
      suggestions JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export { sql };
