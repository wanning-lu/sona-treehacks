export interface Personality {
  traits: string[];
  tone: string;
  background: string;
}

export interface Session {
  id: number;
  userId?: string;
  personality: Personality;
  scenario: string;
  createdAt: Date;
}

export interface Message {
  id: number;
  sessionId: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Feedback {
  id: number;
  sessionId: number;
  analysis: string;
  suggestions: string[];
  createdAt: Date;
}
