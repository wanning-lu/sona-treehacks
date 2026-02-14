"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateFeedback, getFeedback } from "@/lib/actions/feedback";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");

  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push("/setup");
      return;
    }

    async function loadFeedback() {
      // Try to get existing feedback first
      const existing = await getFeedback(parseInt(sessionId!));

      if (existing.success && existing.feedback.length > 0) {
        setFeedback(JSON.parse(existing.feedback[0].suggestions));
      } else {
        // Generate new feedback
        const result = await generateFeedback(parseInt(sessionId!));
        if (result.success) {
          setFeedback(result.feedback);
        }
      }

      setLoading(false);
    }

    loadFeedback();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Analyzing your conversation...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Conversation Feedback</h1>

        {feedback && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-3">Overall Analysis</h2>
              <p className="text-gray-700">{feedback.analysis}</p>
            </div>

            {feedback.strengths && (
              <div className="bg-green-50 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-3 text-green-800">Strengths</h2>
                <ul className="list-disc list-inside space-y-2">
                  {feedback.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-green-700">{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.suggestions && (
              <div className="bg-blue-50 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Suggestions</h2>
                <ul className="list-disc list-inside space-y-2">
                  {feedback.suggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="text-blue-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.areas_for_improvement && (
              <div className="bg-orange-50 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-3 text-orange-800">Areas for Improvement</h2>
                <ul className="list-disc list-inside space-y-2">
                  {feedback.areas_for_improvement.map((area: string, i: number) => (
                    <li key={i} className="text-orange-700">{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => router.push("/setup")}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Start New Conversation
        </button>
      </div>
    </main>
  );
}
