import { describe, it, expect } from "vitest";
import { formatDate, cn } from "../utils";

describe("utils", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15T10:30:00");
      const formatted = formatDate(date);
      expect(formatted).toContain("January");
      expect(formatted).toContain("15");
      expect(formatted).toContain("2024");
    });
  });

  describe("cn", () => {
    it("should join class names", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should filter out falsy values", () => {
      expect(cn("class1", false, null, undefined, "class2")).toBe("class1 class2");
    });
  });
});
