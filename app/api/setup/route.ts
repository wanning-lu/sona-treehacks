import { NextResponse } from "next/server";
import { createTables } from "@/lib/db";

export async function GET() {
  // Add a simple security check - only allow in development or with a secret
  const setupSecret = process.env.SETUP_SECRET;

  if (process.env.NODE_ENV === "production" && !setupSecret) {
    return NextResponse.json(
      { error: "Setup endpoint not available in production without SETUP_SECRET" },
      { status: 403 }
    );
  }

  try {
    await createTables();
    return NextResponse.json({
      success: true,
      message: "Database tables created successfully!"
    });
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
