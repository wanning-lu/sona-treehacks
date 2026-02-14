"use client";

import { useState } from "react";
import { generatePersonality } from "@/lib/actions/personality";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await generatePersonality(preferences);

    if (result.success && result.sessionId) {
      // Redirect to chat with session ID
      router.push(`/chat?session=${result.sessionId}`);
    } else {
      alert("Failed to generate personality. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2">Setup Your Conversation</h1>
        <p className="text-gray-600 mb-8">
          Describe what kind of conversation partner you'd like and what scenario you want to practice.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Preferences
            </label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="E.g., 'I want to practice a job interview with a friendly but professional interviewer for a software engineering position.'"
              className="w-full px-4 py-3 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating..." : "Start Conversation"}
          </button>
        </form>
      </div>
    </main>
  );
}
