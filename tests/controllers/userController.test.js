// tests/controllers/userController.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
const User = require("../../src/models/user");
const userController = require("../../src/controllers/userController");

describe("userController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
  });

  describe("getUser", () => {
    it("renvoie 200 et l'utilisateur existant", async () => {
      const fakeUser = { _id: "u1", username: "alice" };
      req.params.id = "u1";
      vi.spyOn(User, "findById").mockResolvedValue(fakeUser);

      await userController.getUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("u1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });

    it("renvoie 404 si l'utilisateur n'existe pas", async () => {
      req.params.id = "u2";
      vi.spyOn(User, "findById").mockResolvedValue(null);

      await userController.getUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("u2");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("renvoie 500 en cas d'erreur serveur", async () => {
      const err = new Error("boom");
      req.params.id = "u3";
      vi.spyOn(User, "findById").mockRejectedValue(err);

      await userController.getUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("u3");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
        error: err,
      });
    });
  });

  describe("updateUser", () => {
    it("renvoie 200 et l'utilisateur mis à jour", async () => {
      const updated = { _id: "u1", username: "alice2" };
      req.params.id = "u1";
      req.body = { username: "alice2" };
      vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue(updated);

      await userController.updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "u1",
        { username: "alice2" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("renvoie 404 si l'utilisateur à mettre à jour n'existe pas", async () => {
      req.params.id = "u2";
      req.body = { username: "bob2" };
      vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "u2",
        { username: "bob2" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("renvoie 500 en cas d'erreur serveur", async () => {
      const err = new Error("boom");
      req.params.id = "u3";
      req.body = { email: "foo@example.com" };
      vi.spyOn(User, "findByIdAndUpdate").mockRejectedValue(err);

      await userController.updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "u3",
        { email: "foo@example.com" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
        error: err,
      });
    });
  });
});
