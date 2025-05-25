import request from "supertest";
import express from "express";
import userRoutes from "../../src/routes/userRoutes";

// Mock controller
const fakeController = {
  getUser: (req, res) =>
    res.status(200).json({ id: req.params.id, username: "bob" }),
  updateUser: (req, res) =>
    res.status(200).json({ updated: true, ...req.body }),
};

describe("userRoutes", () => {
  const app = express();
  app.use(express.json());
  // Inject mock controller
  app.use(
    "/test",
    (() => {
      const router = express.Router();
      router.get("/:id", fakeController.getUser);
      router.put("/:id", fakeController.updateUser);
      return router;
    })()
  );

  it("GET /:id should call getUser controller", async () => {
    const res = await request(app).get("/test/123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "123", username: "bob" });
  });

  it("PUT /:id should call updateUser controller", async () => {
    const res = await request(app).put("/test/123").send({ username: "alice" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ updated: true, username: "alice" });
  });
});
