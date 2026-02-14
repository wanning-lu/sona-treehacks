"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VoiceRecorder from "@/components/VoiceRecorder";
import ChatMessage from "@/components/ChatMessage";
import { sendMessage } from "@/lib/actions/chat";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push("/setup");
      return;
    }

    // Session is validated, ready to chat
    setLoading(false);
  }, [sessionId, router]);

  async function handleTranscript(text: string) {
    if (!sessionId) return;

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    // Get AI response - conversation state is managed by OpenAI
    const result = await sendMessage(parseInt(sessionId), text);

    if (result.success && result.message) {
      setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
    }
  }

  function handleEndConversation() {
    router.push(`/dashboard?session=${sessionId}`);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Voice Chat</h1>
        <button
          onClick={handleEndConversation}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          End & Get Feedback
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
      </div>

      <div className="bg-white border-t p-6">
        <VoiceRecorder onTranscript={handleTranscript} />
      </div>
    </main>
  );
}
