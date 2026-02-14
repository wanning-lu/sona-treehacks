import { sql } from "@vercel/postgres";

// Note: Vercel Postgres is deprecated. Consider migrating to Neon.
// See: https://neon.com/docs/guides/vercel-postgres-transition-guide

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
