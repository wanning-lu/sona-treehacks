"use server";

import { openai } from "@/lib/openai";
import { sql } from "@/lib/db";
import type { Personality } from "@/lib/types";

/**
 * Agent 1: Generate personality and scenario based on user preferences
 */
export async function generatePersonality(userPreferences: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI that generates chatbot personalities and conversation scenarios.
          Based on user preferences, create a detailed personality profile and scenario description.
          Return a JSON object with: traits (array of personality traits), tone (conversational style),
          background (character background), and scenario (conversation setting).`,
        },
        {
          role: "user",
          content: userPreferences,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Save to database
    const session = await sql`
      INSERT INTO sessions (personality, scenario)
      VALUES (${JSON.stringify(result)}, ${result.scenario})
      RETURNING id, personality, scenario, created_at
    `;

    return {
      success: true,
      sessionId: session.rows[0].id,
      personality: result as Personality,
      scenario: result.scenario,
    };
  } catch (error) {
    console.error("Error generating personality:", error);
    return { success: false, error: "Failed to generate personality" };
  }
}
