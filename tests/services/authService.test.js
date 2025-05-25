// tests/services/authService.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";

import bcrypt from "bcrypt";
import User from "../../src/models/user";
import authService from "../../src/services/authService";

describe("authService", () => {
  const username = "alice";
  const password = "secret";
  const email = "alice@example.com";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("registerUser", () => {
    it("doit hasher le mot de passe, sauvegarder et renvoyer le nouvel utilisateur", async () => {
      // 1️⃣ stub bcrypt.hash
      vi.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");

      // 2️⃣ stub save() sur l'instance User
      const fakeUser = { username, password: "hashedPassword", email };
      User.prototype.save = vi.fn().mockResolvedValue(fakeUser);

      // 3️⃣ appel de registerUser
      const result = await authService.registerUser(username, password, email);

      // 4️⃣ assertions
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(fakeUser);
    });
  });

  describe("loginUser", () => {
    it("doit renvoyer l’utilisateur si credentials valides", async () => {
      // 1️⃣ stub User.findOne
      const storedUser = { username, password: "hashedPwd" };
      vi.spyOn(User, "findOne").mockResolvedValue(storedUser);

      // 2️⃣ stub bcrypt.compare
      vi.spyOn(bcrypt, "compare").mockResolvedValue(true);

      // 3️⃣ appel de loginUser
      const result = await authService.loginUser(username, password);

      // 4️⃣ assertions
      expect(User.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashedPwd");
      expect(result).toBe(storedUser);
    });

    it("doit lever une erreur si l’utilisateur n’existe pas", async () => {
      vi.spyOn(User, "findOne").mockResolvedValue(null);

      await expect(
        authService.loginUser(username, password)
      ).rejects.toThrowError("Invalid username or password");

      expect(User.findOne).toHaveBeenCalledWith({ username });
    });

    it("doit lever une erreur si le mot de passe est invalide", async () => {
      const storedUser = { username, password: "badHash" };
      vi.spyOn(User, "findOne").mockResolvedValue(storedUser);
      vi.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(
        authService.loginUser(username, password)
      ).rejects.toThrowError("Invalid username or password");

      expect(User.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, "badHash");
    });
  });

  describe("validateUser", () => {
    it("doit retourner true si l’utilisateur existe", async () => {
      vi.spyOn(User, "findOne").mockResolvedValue({ username });

      const exists = await authService.validateUser(username);
      expect(User.findOne).toHaveBeenCalledWith({ username });
      expect(exists).toBe(true);
    });

    it("doit retourner false si l’utilisateur n’existe pas", async () => {
      vi.spyOn(User, "findOne").mockResolvedValue(null);

      const exists = await authService.validateUser(username);
      expect(User.findOne).toHaveBeenCalledWith({ username });
      expect(exists).toBe(false);
    });
  });
});
