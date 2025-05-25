import { describe, it, expect } from "vitest";
import helpers from "../../src/utils/helpers";

describe("helpers", () => {
  describe("validatePresentationContent", () => {
    it("should throw if content is missing", () => {
      expect(() => helpers.validatePresentationContent()).toThrow();
      expect(() => helpers.validatePresentationContent(null)).toThrow();
      expect(() => helpers.validatePresentationContent(123)).toThrow();
    });
    it("should not throw for valid string", () => {
      expect(() => helpers.validatePresentationContent("ok")).not.toThrow();
    });
  });

  describe("validateUserInput", () => {
    it("should throw if any field is missing", () => {
      expect(() => helpers.validateUserInput()).toThrow();
      expect(() => helpers.validateUserInput("bob")).toThrow();
      expect(() => helpers.validateUserInput("bob", "pwd")).toThrow();
    });
    it("should throw if password is too short", () => {
      expect(() => helpers.validateUserInput("bob", "123", "a@b.com")).toThrow(
        /at least 6/
      );
    });
    it("should not throw for valid input", () => {
      expect(() =>
        helpers.validateUserInput("bob", "123456", "a@b.com")
      ).not.toThrow();
    });
  });

  describe("isPublicPresentation", () => {
    it("should return true if isPublic is true", () => {
      expect(helpers.isPublicPresentation({ isPublic: true })).toBe(true);
    });
    it("should return false if isPublic is false or missing", () => {
      expect(helpers.isPublicPresentation({ isPublic: false })).toBe(false);
      expect(helpers.isPublicPresentation({})).toBe(false);
    });
  });

  describe("isOwner", () => {
    it("should return true if userId matches authorId", () => {
      expect(helpers.isOwner("123", { authorId: "123" })).toBe(true);
    });
    it("should return false if userId does not match authorId", () => {
      expect(helpers.isOwner("123", { authorId: "456" })).toBe(false);
    });
  });
});
