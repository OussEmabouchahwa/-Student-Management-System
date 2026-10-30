import { describe, it, expect } from "vitest";
import {
  formatGpa,
  formatStudentNumber,
  formatDate,
  getInitials,
} from "./format";

describe("Formatting helpers", () => {
  describe("formatGpa", () => {
    it("formats numbers to two decimal places", () => {
      expect(formatGpa(3.8)).toBe("3.80");
      expect(formatGpa(4)).toBe("4.00");
      expect(formatGpa(2.95)).toBe("2.95");
    });

    it("returns 'Not graded' for null or undefined", () => {
      expect(formatGpa(null)).toBe("Not graded");
      expect(formatGpa(undefined)).toBe("Not graded");
      expect(formatGpa(NaN)).toBe("Not graded");
    });
  });

  describe("formatStudentNumber", () => {
    it("formats student number as YYYY-NNNN", () => {
      const res = formatStudentNumber("cuid123456", "2026-05-12T00:00:00Z");
      expect(res).toMatch(/^2026-\d{4}$/);
    });

    it("is deterministic for the same id and date", () => {
      const num1 = formatStudentNumber("abc", "2025-01-01");
      const num2 = formatStudentNumber("abc", "2025-01-01");
      expect(num1).toBe(num2);
    });
  });

  describe("formatDate", () => {
    it("formats valid date string", () => {
      const res = formatDate("2026-10-31T12:00:00Z");
      expect(res).toBe("Oct 31, 2026");
    });

    it("returns empty string on invalid date", () => {
      expect(formatDate("invalid-date")).toBe("");
    });
  });

  describe("getInitials", () => {
    it("returns two capital letters", () => {
      expect(getInitials("Amira", "Ben Salah")).toBe("AB");
      expect(getInitials("marcus", "vance")).toBe("MV");
    });

    it("handles whitespace gracefully", () => {
      expect(getInitials("  Elena  ", "  Rostova  ")).toBe("ER");
    });
  });
});
