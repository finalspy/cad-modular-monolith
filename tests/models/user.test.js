import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../src/models/user";

// src/models/user.test.js

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
  await User.syncIndexes(); // <-- Ajoute cette ligne
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe("User model", () => {
    it("should require username", async () => {
        const user = new User({ password: "pwd", email: "a@b.com" });
        await expect(user.save()).rejects.toThrow();
    });

    it("should require password", async () => {
        const user = new User({ username: "bob", email: "a@b.com" });
        await expect(user.save()).rejects.toThrow();
    });

    it("should require email", async () => {
        const user = new User({ username: "bob", password: "pwd" });
        await expect(user.save()).rejects.toThrow();
    });

    it("should save with all required fields", async () => {
        const user = new User({ username: "bob", password: "pwd", email: "a@b.com" });
        const saved = await user.save();
        expect(saved.username).toBe("bob");
        expect(saved.email).toBe("a@b.com");
    });

    it("should enforce unique username", async () => {
      await new User({
        username: "bob",
        password: "pwd",
        email: "a@b.com",
      }).save();
      const user2 = new User({
        username: "bob",
        password: "pwd2",
        email: "b@b.com",
      });
      let error;
      try {
        await user2.save();
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      // Optionnel : vérifie le code d’erreur MongoDB
      expect(error).toHaveProperty("code", 11000);
    });

    it("should enforce unique email", async () => {
      await new User({
        username: "bob",
        password: "pwd",
        email: "a@b.com",
      }).save();
      const user2 = new User({
        username: "alice",
        password: "pwd2",
        email: "a@b.com",
      });
      let error;
      try {
        await user2.save();
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error).toHaveProperty("code", 11000);
    });
});