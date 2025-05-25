// tests/controllers/authController.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
const authService = require("../../src/services/authService");
const User = require("../../src/models/user");
const authController = require("../../src/controllers/authController");

describe("authController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {}, session: { destroy: vi.fn() } };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      render: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
    };
    // Par défaut, pas d'utilisateur existant
    vi.spyOn(User, "findOne").mockResolvedValue(null);
  });

  describe("register", () => {
    it("redirige vers / après inscription réussie", async () => {
      req.body = {
        username: "bob",
        password: "pass",
        email: "bob@example.com",
      };
      vi.spyOn(authService, "registerUser").mockResolvedValue({ _id: "u1" });

      await authController.register(req, res);

      // on n'appelle pas res.status ni res.json mais bien res.redirect
      expect(authService.registerUser).toHaveBeenCalledWith(
        "bob",
        "pass",
        "bob@example.com"
      );
      expect(res.redirect).toHaveBeenCalledWith("/");
    });

    it("renvoie 500 et render en cas d’erreur du service", async () => {
      req.body = {
        username: "bob",
        password: "pass",
        email: "bob@example.com",
      };
      const err = new Error("boom");
      vi.spyOn(authService, "registerUser").mockRejectedValue(err);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.render).toHaveBeenCalledWith("register", {
        error: "An unexpected error occurred. Please try again.",
      });
    });
  });

  describe("login", () => {
    it("redirige vers / et met à jour la session si credentials valides", async () => {
      req.body = { username: "bob", password: "pass" };
      const user = { _id: "u1", username: "bob" };
      vi.spyOn(authService, "loginUser").mockResolvedValue(user);

      await authController.login(req, res);

      expect(authService.loginUser).toHaveBeenCalledWith("bob", "pass");
      expect(req.session.user).toEqual({ id: "u1", username: "bob" });
      expect(res.redirect).toHaveBeenCalledWith("/");
    });

    it("renvoie 401 et JSON si credentials invalides", async () => {
      req.body = { username: "bob", password: "wrong" };
      const err = new Error("Invalid username or password");
      vi.spyOn(authService, "loginUser").mockRejectedValue(err);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: err.message });
    });
  });

  describe("logout", () => {
    it("redirige vers / si déconnexion OK", () => {
      req.session.destroy.mockImplementation((cb) => cb(null));

      authController.logout(req, res);

      expect(req.session.destroy).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith("/");
    });

    it("renvoie 500 et render si erreur destroy", () => {
      const err = new Error("destroy failed");
      req.session.destroy.mockImplementation((cb) => cb(err));

      authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.render).toHaveBeenCalledWith("login", {
        error: "An error occurred while logging out. Please try again.",
      });
    });
  });
});
