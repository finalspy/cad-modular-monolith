import { describe, it, expect, beforeEach, vi } from "vitest";
const authMiddleware = require("../../src/middleware/authMiddleware");

// src/middleware/authMiddleware.test.js

describe("authMiddleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = { redirect: vi.fn() };
        next = vi.fn();
    });

    it("calls next() if req.session.user exists", () => {
        req.session = { user: { id: "u1" } };

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it("redirects to /auth/login if req.session is missing", () => {
        req.session = undefined;

        authMiddleware(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
        expect(next).not.toHaveBeenCalled();
    });

    it("redirects to /auth/login if req.session.user is missing", () => {
        req.session = {};

        authMiddleware(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
        expect(next).not.toHaveBeenCalled();
    });

    it("redirects to /auth/login if req.session.user is falsy", () => {
        req.session = { user: null };

        authMiddleware(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith("/auth/login");
        expect(next).not.toHaveBeenCalled();
    });

    it("never calls both next and res.redirect", () => {
      req.session = { user: { id: "u1" } };
      authMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();

      req.session = undefined;
      next.mockClear();
      res.redirect.mockClear();
      authMiddleware(req, res, next);
      expect(res.redirect).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

});

it("is a function with (req, res, next) signature", () => {
    expect(typeof authMiddleware).toBe("function");
    expect(authMiddleware.length).toBe(3);
});

