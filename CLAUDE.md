# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sona TreeHacks is a voice-based AI chatbot web application that allows users to practice conversations with AI-powered personalities and receive feedback on their performance. The app uses three distinct AI agents to provide a complete learning experience.

**Tech Stack:**
- Next.js 16 with TypeScript and App Router
- Tailwind CSS v4
- OpenAI GPT-5 for AI agents
- OpenAI Whisper for voice-to-text transcription
- Vercel Postgres for data persistence (deprecated - consider migrating to Neon)
- Vitest for testing
- Deployed on Vercel

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linter
- `npm test` - Run Vitest tests in watch mode
- `npm run test:run` - Run tests once (useful for CI)

## Architecture

### Three AI Agents

The application is built around three distinct AI agents, each with specific responsibilities:

1. **Personality Agent** ([lib/actions/personality.ts](lib/actions/personality.ts))
   - Generates chatbot personalities and conversation scenarios using Chat Completions API
   - Creates an OpenAI Conversation with the generated personality as system instructions
   - Stores conversation ID in database for state management
   - Returns personality traits, tone, background, and scenario

2. **Conversation Agent** ([lib/actions/chat.ts](lib/actions/chat.ts))
   - Main chatbot that user interacts with via voice
   - Uses OpenAI Responses API with Conversations for stateful interactions
   - OpenAI manages conversation history automatically - no manual message tracking needed
   - Handles voice transcription via OpenAI Whisper
   - Caches messages locally for feedback analysis

3. **Feedback Agent** ([lib/actions/feedback.ts](lib/actions/feedback.ts))
   - Analyzes complete conversation transcripts using Responses API
   - Provides constructive feedback, strengths, and areas for improvement
   - Generates actionable suggestions
   - Stores feedback in database

### Application Flow

1. **Setup** ([app/setup/page.tsx](app/setup/page.tsx)) - User describes desired conversation partner and scenario
2. **Chat** ([app/chat/page.tsx](app/chat/page.tsx)) - User engages in voice conversation with AI
3. **Dashboard** ([app/dashboard/page.tsx](app/dashboard/page.tsx)) - User receives detailed feedback and analysis

### Directory Structure

```
app/
  ├── page.tsx              # Landing page
  ├── setup/page.tsx        # Personality generation
  ├── chat/page.tsx         # Voice chat interface
  ├── dashboard/page.tsx    # Feedback display
  ├── layout.tsx            # Root layout
  └── globals.css           # Global styles + Tailwind

components/
  ├── VoiceRecorder.tsx     # Voice recording UI with MediaRecorder API
  ├── ChatMessage.tsx       # Chat message display component
  └── __tests__/            # Component tests

lib/
  ├── actions/              # Server Actions (all three agents)
  │   ├── personality.ts    # Agent 1: Generate personality
  │   ├── chat.ts          # Agent 2: Handle conversation
  │   └── feedback.ts      # Agent 3: Analyze & provide feedback
  ├── openai.ts            # OpenAI client configuration
  ├── db.ts                # Database connection and schema
  ├── types.ts             # TypeScript type definitions
  ├── utils.ts             # Utility functions
  └── __tests__/           # Library tests
```

## Key Technical Details

### Server Actions vs API Routes

This project uses Next.js Server Actions instead of traditional API routes. Server Actions allow:
- Direct server-side function calls from client components
- No need to create separate API endpoints
- Type-safe communication between client and server
- Simplified data mutations and fetching

All server actions are marked with `"use server"` directive and located in `lib/actions/`.

### OpenAI Conversations + Responses API

The project uses OpenAI's Conversations and Responses APIs for state management:
- **Conversations API** (`openai.conversations.create`) - Creates persistent conversation context
- **Responses API** (`openai.responses.create`) - Generates responses with automatic state management
- Conversation state is maintained by OpenAI, eliminating manual message history tracking
- Each session stores an OpenAI `conversation_id` for stateful interactions

### Database Schema

Three main tables (defined in [lib/db.ts](lib/db.ts)):
- `sessions` - Stores conversation sessions with OpenAI conversation_id, personality, and scenario
- `transcripts` - Local cache of messages for feedback analysis (OpenAI maintains authoritative state)
- `feedback` - Stores AI-generated analysis and feedback for sessions

### Voice Recording

The [VoiceRecorder component](components/VoiceRecorder.tsx) uses:
- Browser MediaRecorder API for capturing audio
- OpenAI Whisper API for speech-to-text transcription
- WebM audio format for recording

### Environment Variables

Required environment variables (see [.env.example](.env.example)):
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 and Whisper
- `POSTGRES_*` - Database credentials (auto-provided by Vercel in production)

**Note:** Vercel Postgres is deprecated. For new databases, consider migrating to Neon as recommended by Vercel.

## Testing

Tests are written using Vitest with React Testing Library:
- Component tests in `components/__tests__/`
- Utility tests in `lib/__tests__/`
- Run tests with `npm test`
- Configuration in [vitest.config.ts](vitest.config.ts)

## Deployment

Deploy to Vercel:
1. Connect GitHub repository to Vercel
2. Add `OPENAI_API_KEY` to environment variables
3. Set up Vercel Postgres (or Neon) and environment variables will be auto-populated
4. Deploy

## Important Conventions

- All client components must have `"use client"` directive
- All server actions must have `"use server"` directive
- Use `@/` path alias for imports from root directory
- Follow existing Tailwind styling patterns for consistency
- Store all AI logic in `lib/actions/` as server actions
- Keep components presentational; business logic stays in server actions
