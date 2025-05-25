import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Presentation from "../../src/models/presentation";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Presentation.deleteMany({});
});

describe("Presentation model", () => {
  const baseData = {
    title: "Titre",
    content: "Contenu",
    authorId: new mongoose.Types.ObjectId(),
    username: "alice",
  };

  it("should require title", async () => {
    const pres = new Presentation({ ...baseData, title: undefined });
    await expect(pres.save()).rejects.toThrow();
  });

  it("should require content", async () => {
    const pres = new Presentation({ ...baseData, content: undefined });
    await expect(pres.save()).rejects.toThrow();
  });

  it("should require authorId", async () => {
    const pres = new Presentation({ ...baseData, authorId: undefined });
    await expect(pres.save()).rejects.toThrow();
  });

  it("should require username", async () => {
    const pres = new Presentation({ ...baseData, username: undefined });
    await expect(pres.save()).rejects.toThrow();
  });

  it("should save with all required fields", async () => {
    const pres = new Presentation(baseData);
    const saved = await pres.save();
    expect(saved.title).toBe(baseData.title);
    expect(saved.content).toBe(baseData.content);
    expect(saved.authorId.toString()).toBe(baseData.authorId.toString());
    expect(saved.username).toBe(baseData.username);
    expect(saved.isPublic).toBe(false);
  });

  it("should allow isPublic to be true", async () => {
    const pres = new Presentation({ ...baseData, isPublic: true });
    const saved = await pres.save();
    expect(saved.isPublic).toBe(true);
  });
});
