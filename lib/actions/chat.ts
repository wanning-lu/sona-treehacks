"use server";

import { openai } from "@/lib/openai";
import { sql } from "@/lib/db";
import type { Personality } from "@/lib/types";

/**
 * Agent 2: Main conversation agent - responds to user messages with given personality
 */
export async function sendMessage(
  sessionId: number,
  userMessage: string,
  personality: Personality
) {
  try {
    // Save user message to database
    await sql`
      INSERT INTO transcripts (session_id, role, content)
      VALUES (${sessionId}, 'user', ${userMessage})
    `;

    // Get conversation history
    const history = await sql`
      SELECT role, content FROM transcripts
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `;

    // Build messages array for OpenAI
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: `You are a chatbot with the following personality:
        Traits: ${personality.traits.join(", ")}
        Tone: ${personality.tone}
        Background: ${personality.background}

        Engage in natural conversation while maintaining this personality.`,
      },
      ...history.rows.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const assistantMessage = completion.choices[0].message.content || "";

    // Save assistant message to database
    await sql`
      INSERT INTO transcripts (session_id, role, content)
      VALUES (${sessionId}, 'assistant', ${assistantMessage})
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
