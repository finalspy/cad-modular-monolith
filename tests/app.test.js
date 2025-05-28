import request from "supertest";
import app from "../src/app"; // si exporté

vi.mock("mongoose", () => ({
  connect: vi.fn(), // évite la vraie connexion
}));

describe("App integration", () => {
  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
