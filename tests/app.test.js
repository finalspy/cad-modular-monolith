import request from "supertest";
import express from "express";
import app from "../src/app"; // si exporté

describe("App integration", () => {
  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
