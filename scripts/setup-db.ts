import { createTables } from "../lib/db";

async function setupDatabase() {
  try {
    console.log("Creating database tables...");
    await createTables();
    console.log("✅ Database tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    process.exit(1);
  }
}

setupDatabase();
