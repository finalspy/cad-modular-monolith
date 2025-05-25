import { describe, it, expect, beforeEach, vi } from "vitest";
const presentationService = require("../../src/services/presentationService");
const controller = require("../../src/controllers/presentationController");

describe("presentationController", () => {
  let req;
  let res;
  const htmlBuffer = Buffer.from("<section>Slide</section>", "utf-8");

  beforeEach(() => {
    req = { body: {}, session: { user: null }, files: undefined, params: {} };
    res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.redirect = vi.fn().mockReturnValue(res);
    res.render = vi.fn().mockReturnValue(res);
  });

  describe("createPresentation", () => {
    it("renvoie 401 si non connecté", async () => {
      await controller.createPresentation(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized: Please log in to create a presentation.",
      });
    });

    it("renvoie 400 si pas de fichier uploadé", async () => {
      req.session.user = { id: "u1" };
      req.files = undefined;
      await controller.createPresentation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "No HTML file uploaded.",
      });
    });

    it("renvoie 400 si mimetype incorrect", async () => {
      req.session.user = { id: "u1" };
      req.files = { htmlFile: { mimetype: "text/plain", data: htmlBuffer } };
      await controller.createPresentation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Uploaded file must be an HTML file.",
      });
    });

    it("renvoie 400 si pas de <section> dans le HTML", async () => {
      req.session.user = { id: "u1" };
      req.files = {
        htmlFile: { mimetype: "text/html", data: Buffer.from("<div></div>") },
      };
      await controller.createPresentation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "HTML file must contain <section> tags for Reveal.js slides.",
      });
    });

    it("redirige vers / après création réussie", async () => {
      req.session.user = { id: "u1" };
      req.body = { title: "T", isPublic: "on" };
      req.files = { htmlFile: { mimetype: "text/html", data: htmlBuffer } };
      vi.spyOn(presentationService, "createPresentation").mockResolvedValue({
        _id: "p1",
      });

      await controller.createPresentation(req, res);
      expect(presentationService.createPresentation).toHaveBeenCalledWith({
        title: "T",
        content: htmlBuffer.toString("utf-8"),
        isPublic: true,
        authorId: "u1",
      });
      expect(res.redirect).toHaveBeenCalledWith("/");
    });

    it("renvoie 500 si service en erreur", async () => {
      req.session.user = { id: "u1" };
      req.body = { title: "T", isPublic: "on" };
      req.files = { htmlFile: { mimetype: "text/html", data: htmlBuffer } };
      const err = new Error("boom");
      vi.spyOn(presentationService, "createPresentation").mockRejectedValue(
        err
      );

      await controller.createPresentation(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating presentation",
        error: err,
      });
    });
  });

  describe("listPresentations", () => {
    it("rend la vue avec un tableau de présentations (cas nominal)", async () => {
      const mockData = [{ _id: "p1" }, { _id: "p2" }];
      vi.spyOn(presentationService, "listPresentations").mockResolvedValue(
        mockData
      );

      await controller.listPresentations(req, res);

      expect(presentationService.listPresentations).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith("listPresentations", {
        presentations: mockData,
        message: null,
      });
    });

    it("rend la vue avec message si aucune présentation", async () => {
      vi.spyOn(presentationService, "listPresentations").mockResolvedValue([]);

      await controller.listPresentations(req, res);

      expect(presentationService.listPresentations).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith("listPresentations", {
        presentations: null,
        message: "No presentations to display.",
      });
    });

    it("rend la vue avec message d'erreur si service échoue", async () => {
      const err = new Error("fails");
      vi.spyOn(presentationService, "listPresentations").mockRejectedValue(err);

      await controller.listPresentations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.render).toHaveBeenCalledWith("listPresentations", {
        presentations: null,
        message: "An error occurred while retrieving presentations.",
      });
    });
  });

  describe("viewPresentation", () => {
    const publicPres = {
      _id: "p1",
      content: "C",
      title: "T",
      isPublic: true,
      authorId: "u1",
    };

    it("rend la présentation publique", async () => {
      vi.spyOn(presentationService, "viewPresentation").mockResolvedValue(
        publicPres
      );

      req.params = { id: "p1" };
      await controller.viewPresentation(req, res);

      expect(presentationService.viewPresentation).toHaveBeenCalledWith(
        "p1",
        null
      );
      expect(res.render).toHaveBeenCalledWith("reveal", {
        content: "C",
        title: "T",
      });
    });

    it("rend la présentation privée si auteur connecté", async () => {
      const privPres = { ...publicPres, isPublic: false };
      vi.spyOn(presentationService, "viewPresentation").mockResolvedValue(
        privPres
      );

      req.params = { id: "p1" };
      req.session.user = { id: "u1" };
      await controller.viewPresentation(req, res);

      expect(presentationService.viewPresentation).toHaveBeenCalledWith(
        "p1",
        "u1"
      );
      expect(res.render).toHaveBeenCalledWith("reveal", {
        content: "C",
        title: "T",
      });
    });

    it("renvoie 500 et message si erreur service", async () => {
      const err = new Error("boom");
      vi.spyOn(presentationService, "viewPresentation").mockRejectedValue(err);

      req.params = { id: "p1" };
      await controller.viewPresentation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error retrieving presentation",
        error: err,
      });
    });
  });
});
