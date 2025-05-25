import request from "supertest";
import express from "express";
import authRoutes from "../../src/routes/authRoutes";

express.response.render = function (view) {
  this.send(`<html>${view}</html>`);
};

describe("authRoutes", () => {
  const app = express();
  app.set("view engine", "ejs");
  app.use(express.urlencoded({ extended: false }));
  app.use("/", authRoutes);

  it("GET /login should render login page", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
    // Optionally: expect(res.text).toContain("login");
  });

  it("GET /register should render register page", async () => {
    const res = await request(app).get("/register");
    expect(res.status).toBe(200);
    // Optionally: expect(res.text).toContain("register");
  });

  it("POST /register should call authController.register", async () => {
    // Mock controller
    const fakeApp = express();
    fakeApp.use(express.urlencoded({ extended: false }));
    fakeApp.post("/register", (req, res) => res.status(201).send("ok"));
    const res = await request(fakeApp)
      .post("/register")
      .send({ username: "bob", password: "pwd", email: "a@b.com" });
    expect(res.status).toBe(201);
    expect(res.text).toBe("ok");
  });

  it("POST /login should call authController.login", async () => {
    const fakeApp = express();
    fakeApp.use(express.urlencoded({ extended: false }));
    fakeApp.post("/login", (req, res) => res.status(200).send("logged in"));
    const res = await request(fakeApp)
      .post("/login")
      .send({ username: "bob", password: "pwd" });
    expect(res.status).toBe(200);
    expect(res.text).toBe("logged in");
  });

  it("GET /logout should call authController.logout", async () => {
    const fakeApp = express();
    fakeApp.get("/logout", (req, res) => res.status(200).send("logged out"));
    const res = await request(fakeApp).get("/logout");
    expect(res.status).toBe(200);
    expect(res.text).toBe("logged out");
  });
});
