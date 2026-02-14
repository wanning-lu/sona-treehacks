"use server";

import { openai } from "@/lib/openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { sql } from "@/lib/db";

// export interface Feedback {
//   id: number;
//   sessionId: number;
//   analysis: string;
//   suggestions: string[];
//   createdAt: Date;
// }

const Feedback = z.object({
  analysis: z.string(),
  suggestions: z.array(z.string()),
  strengths: z.array(z.string()),
  areas_for_improvement: z.array(z.string())
});

/**
 * Analyze conversation transcript and give the language learner tips
 */
export async function generateFeedback(sessionId: number) {
  try {
    // Get conversation transcript from database
    const transcript = await sql`
      SELECT role, content, timestamp FROM transcripts
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `;

    if (transcript.length === 0) {
      return { success: false, error: "No transcript found" };
    }

    // Format transcript for analysis
    const conversationText = transcript
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    // Use Responses API for feedback generation
    const response = await openai.responses.parse({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: `You are an expert conversation analyst. Analyze the following conversation transcript
          and provide constructive feedback for where the role is a user in JSON format with:
          - analysis: overall analysis of the conversation quality
          - suggestions: array of specific improvement suggestions
          - strengths: array of things the user did well
          - areas_for_improvement: array of areas to work on

          Respond ONLY with valid JSON.`,
        },
        {
          role: "user",
          content: conversationText,
        },
      ],
      text: {
        format: zodTextFormat(Feedback, "feedback"),
      },
    });

    // Parse JSON from response
    const feedback = response.output_parsed

    if (!feedback) {
      return { success: false, error: "Failed to parse feedback response" };
    }

    // Save feedback to database
    await sql`
      INSERT INTO feedback (session_id, analysis, suggestions, strengths, areas_for_improvement)
      VALUES (${sessionId}, ${feedback.analysis}, ${JSON.stringify(feedback.suggestions)}, ${JSON.stringify(feedback.strengths)}, ${JSON.stringify(feedback.areas_for_improvement)})
    `;

    return { success: true, feedback };
  } catch (error) {
    console.error("Error generating feedback:", error);
    return { success: false, error: "Failed to generate feedback" };
  }
}

/**
 * Get all feedback for a session
 */
export async function getFeedback(sessionId: number) {
  try {
    const result = await sql`
      SELECT * FROM feedback
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
    `;

    return { success: true, feedback: result };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return { success: false, error: "Failed to fetch feedback" };
  }
}
