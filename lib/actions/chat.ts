"use server";

import { openai } from "@/lib/openai";
import { sql } from "@/lib/db";

/**
 * Agent 2: Main conversation agent - responds to user messages using Conversations API
 */
export async function sendMessage(sessionId: number, userMessage: string) {
  try {
    // Get conversation ID from database
    const session = await sql`
      SELECT conversation_id FROM sessions WHERE id = ${sessionId}
    `;

    if (!session.rows.length) {
      return { success: false, error: "Session not found" };
    }

    const conversationId = session.rows[0].conversation_id;

    // Use Responses API with conversation ID - OpenAI manages conversation state
    const response = await openai.responses.create({
      model: "gpt-5",
      conversation: conversationId,
      input: [{ role: "user", content: userMessage }],
    });

    const assistantMessage = response.output_text || "";

    // Cache messages in our database for feedback analysis
    await sql`
      INSERT INTO transcripts (session_id, role, content)
      VALUES (${sessionId}, 'user', ${userMessage}),
             (${sessionId}, 'assistant', ${assistantMessage})
    `;

    return { success: true, message: assistantMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

/**
 * Transcribe audio using OpenAI Whisper
 */
export async function transcribeAudio(audioFile: File) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return { success: true, text: transcription.text };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return { success: false, error: "Failed to transcribe audio" };
  }
}
