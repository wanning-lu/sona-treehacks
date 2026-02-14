# Sona

A voice-based AI chatbot application that helps users practice conversations with AI-powered personalities and receive personalized feedback.

## Features

- 🎭 **Custom AI Personalities** - Generate unique conversation partners based on your preferences
- 🎤 **Voice Chat** - Speak naturally with AI using voice-to-text transcription
- 📊 **Intelligent Feedback** - Get detailed analysis and suggestions to improve your conversation skills

## Tech Stack

- **Framework:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** OpenAI GPT-5 for conversation and analysis, Whisper for voice transcription
- **Database:** Neon Postgres
- **Testing:** Vitest with React Testing Library
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Neon database (free tier available at [neon.tech](https://neon.tech))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your credentials to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_key_here
   DATABASE_URL=your_neon_database_url_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Setup** - Describe what kind of conversation partner you want (e.g., job interviewer, language tutor)
2. **Chat** - Have a voice conversation with the AI using your microphone
3. **Dashboard** - Review detailed feedback on your performance

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
npm test         # Run tests
```

## Project Structure

- `/app` - Next.js pages and routes
- `/components` - Reusable React components
- `/lib` - Utilities, types, and server actions
  - `/lib/actions` - Three AI agents (personality, chat, feedback)

## License

ISC
