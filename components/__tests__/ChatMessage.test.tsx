import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatMessage from "../ChatMessage";

describe("ChatMessage", () => {
  it("should render user message", () => {
    render(<ChatMessage role="user" content="Hello!" />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("should render assistant message", () => {
    render(<ChatMessage role="assistant" content="Hi there!" />);
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("should apply correct styles for user", () => {
    const { container } = render(<ChatMessage role="user" content="Test" />);
    const messageDiv = container.querySelector(".bg-blue-600");
    expect(messageDiv).toBeInTheDocument();
  });

  it("should apply correct styles for assistant", () => {
    const { container } = render(<ChatMessage role="assistant" content="Test" />);
    const messageDiv = container.querySelector(".bg-white");
    expect(messageDiv).toBeInTheDocument();
  });
});
