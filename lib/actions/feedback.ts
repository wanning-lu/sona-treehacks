"use server";

import { openai } from "@/lib/openai";
import { sql } from "@/lib/db";

/**
 * Agent 3: Analyze conversation transcript and provide feedback
 */
export async function generateFeedback(sessionId: number) {
  try {
    // Get conversation transcript
    const transcript = await sql`
      SELECT role, content, timestamp FROM transcripts
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `;

    if (transcript.rows.length === 0) {
      return { success: false, error: "No transcript found" };
    }

    // Format transcript for analysis
    const conversationText = transcript.rows
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    // Get AI feedback
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert conversation analyst. Analyze the following conversation transcript
          and provide constructive feedback. Return a JSON object with:
          - analysis: overall analysis of the conversation quality
          - suggestions: array of specific improvement suggestions
          - strengths: array of things the user did well
          - areas_for_improvement: array of areas to work on`,
        },
        {
          role: "user",
          content: conversationText,
        },
      ],
      response_format: { type: "json_object" },
    });

    const feedback = JSON.parse(completion.choices[0].message.content || "{}");

    // Save feedback to database
    await sql`
      INSERT INTO feedback (session_id, analysis, suggestions)
      VALUES (${sessionId}, ${feedback.analysis}, ${JSON.stringify(feedback.suggestions)})
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

    return { success: true, feedback: result.rows };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return { success: false, error: "Failed to fetch feedback" };
  }
}
