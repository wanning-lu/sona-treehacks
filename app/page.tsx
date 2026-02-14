import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">Sona TreeHacks</h1>
        <p className="text-xl text-white/90">
          Practice conversations with AI-powered voice chat and get personalized feedback
        </p>

        <div className="pt-8">
          <Link
            href="/setup"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            Start Your First Conversation
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-6 text-white">
          <div className="space-y-2">
            <div className="text-3xl">🎭</div>
            <h3 className="font-semibold">Custom Personalities</h3>
            <p className="text-sm text-white/80">AI generates unique conversation partners</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🎤</div>
            <h3 className="font-semibold">Voice Chat</h3>
            <p className="text-sm text-white/80">Speak naturally with AI transcription</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">📊</div>
            <h3 className="font-semibold">Get Feedback</h3>
            <p className="text-sm text-white/80">AI analyzes and improves your skills</p>
          </div>
        </div>
      </div>
    </main>
  );
}
