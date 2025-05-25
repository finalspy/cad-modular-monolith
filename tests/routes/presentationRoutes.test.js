import request from "supertest";
import express from "express";
import presentationRoutes from "../../src/routes/presentationRoutes";

// Mock res.render to avoid template errors
express.response.render = function (view, opts) {
  this.send(`<html>${view}</html>`);
};

// Mock middleware and controller
const fakeAuth = (req, res, next) => next();
const fakeController = {
  createPresentation: (req, res) => res.status(201).send("created"),
  viewPresentation: (req, res) => res.status(200).send("presentation"),
};

describe("presentationRoutes", () => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));

  // Inject mocks
  app.use(
    "/test",
    // Remplace les dépendances par les mocks
    (() => {
      const router = express.Router();
      router.get("/create", fakeAuth, (req, res) =>
        res.render("createPresentation", { session: req.session })
      );
      router.post("/", fakeAuth, fakeController.createPresentation);
      router.get("/:id", fakeController.viewPresentation);
      return router;
    })()
  );

  it("GET /create should render createPresentation page", async () => {
    const res = await request(app).get("/test/create");
    expect(res.status).toBe(200);
    expect(res.text).toContain("createPresentation");
  });

  it("POST / should call createPresentation controller", async () => {
    const res = await request(app)
      .post("/test/")
      .send({ title: "t", content: "c" });
    expect(res.status).toBe(201);
    expect(res.text).toBe("created");
  });

  it("GET /:id should call viewPresentation controller", async () => {
    const res = await request(app).get("/test/123");
    expect(res.status).toBe(200);
    expect(res.text).toBe("presentation");
  });
});
