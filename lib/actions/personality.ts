"use server";

import { openai } from "@/lib/openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { sql } from "@/lib/db";
import { Personality } from "@/lib/types";

const PersonalityObj = z.object({
  traits: z.array(z.string()),
  tone: z.string(),
  background: z.string(),
  scenario: z.string()
});

/**
 * Generate personality and scenario details based on user preferences
 */
export async function generatePersonality(userPreferences: string) {
  try {
    // First, generate the personality using chat completions
    const response = await openai.responses.parse({
      model: "gpt-5",
      input: [
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
      text: {
        format: zodTextFormat(PersonalityObj, "personality_traits"),
      },
    });

    const result = response.output_parsed;

    if (!result) {
      return { success: false, error: "Failed to parse personality response" };
    }

    // Create a conversation with the generated personality using Conversations API
    const conversation = await openai.conversations.create({
      metadata: {
        personality: result.traits.join(", "),
        tone: result.tone,
        background: result.background,
        scenario: result.scenario,
      },
      items: [
        {
          type: "message",
          role: "system",
          content: `You are a chatbot with the following personality:
            Traits: ${result.traits.join(", ")}
            Tone: ${result.tone}
            Background: ${result.background}
            Scenario: ${result.scenario}

            Engage in natural conversation while maintaining this personality.`,
        },
      ],
    });

    // Save to database with conversation ID
    const session = await sql`
      INSERT INTO sessions (conversation_id, personality, scenario)
      VALUES (${conversation.id}, ${JSON.stringify(result)}, ${result.scenario})
      RETURNING id, conversation_id, personality, scenario, created_at
    `;

    return {
      success: true,
      sessionId: session.rows[0].id,
      conversationId: conversation.id,
      personality: result as Personality,
      scenario: result.scenario
    };
  } catch (error) {
    console.error("Error generating personality:", error);
    return { success: false, error: "Failed to generate personality" };
  }
}
