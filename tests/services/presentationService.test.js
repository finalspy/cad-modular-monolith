// tests/services/presentationService.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";

import User from "../../src/models/user";
import Presentation from "../../src/models/presentation";
import {
  createPresentation,
  listPresentations,
  viewPresentation,
} from "../../src/services/presentationService";

describe("presentationService", () => {
  const validUserId = "507f1f77bcf86cd799439011";
  const otherUserId = "507f1f77bcf86cd799439012";
  const validPresId = "507f191e810c19729de860ea";
  const data = {
    title: "T",
    content: "C",
    isPublic: true,
    authorId: validUserId,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("createPresentation", () => {
    beforeEach(() => {
      // mock findById().select()
      const fakeSelect = vi
        .fn()
        .mockResolvedValue({ _id: validUserId, username: "bob" });
      vi.spyOn(User, "findById").mockReturnValue({ select: fakeSelect });

      // mock save()
      const saveMock = vi.fn().mockResolvedValue({ ...data, username: "bob" });
      Presentation.prototype.save = saveMock;
    });

    it("doit appeler save et renvoyer username", async () => {
      const result = await createPresentation(data);
      expect(User.findById).toHaveBeenCalledWith(validUserId);
      expect(User.findById().select).toHaveBeenCalledWith("username");
      expect(Presentation.prototype.save).toHaveBeenCalled();
      expect(result.username).toBe("bob");
    });

    it("doit lever si l’auteur est introuvable", async () => {
      // override pour simuler select() qui renvoie null
      vi.spyOn(User, "findById").mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      });

      await expect(createPresentation(data)).rejects.toThrowError(
        "Author not found"
      );
    });
  });

  describe("listPresentations", () => {
    it("doit retourner un tableau de présentations (cas nominal)", async () => {
      const fakeList = [{ _id: "1" }, { _id: "2" }];
      vi.spyOn(Presentation, "find").mockResolvedValue(fakeList);

      const result = await listPresentations(validUserId);
      expect(Presentation.find).toHaveBeenCalledWith({
        $or: [{ isPublic: true }, { authorId: validUserId }],
      });
      expect(result).toBe(fakeList);
    });

    it("doit retourner un tableau vide si aucune présentation", async () => {
      vi.spyOn(Presentation, "find").mockResolvedValue([]);

      const result = await listPresentations(otherUserId);
      expect(Presentation.find).toHaveBeenCalledWith({
        $or: [{ isPublic: true }, { authorId: otherUserId }],
      });
      expect(result).toEqual([]);
    });
  });

  describe("viewPresentation", () => {
    it("doit renvoyer une présentation publique", async () => {
      const fakePres = {
        _id: validPresId,
        isPublic: true,
        authorId: otherUserId,
      };
      vi.spyOn(Presentation, "findById").mockResolvedValue(fakePres);

      const result = await viewPresentation(validPresId, validUserId);
      expect(Presentation.findById).toHaveBeenCalledWith(validPresId);
      expect(result).toBe(fakePres);
    });

    it("doit renvoyer une présentation privée si auteur", async () => {
      const fakePres = {
        _id: validPresId,
        isPublic: false,
        authorId: validUserId,
        toString() {
          return validUserId;
        },
      };
      vi.spyOn(Presentation, "findById").mockResolvedValue(fakePres);

      const result = await viewPresentation(validPresId, validUserId);
      expect(Presentation.findById).toHaveBeenCalledWith(validPresId);
      expect(result).toBe(fakePres);
    });

    it("doit lever si pas de présentation trouvée", async () => {
      vi.spyOn(Presentation, "findById").mockResolvedValue(null);

      await expect(
        viewPresentation(validPresId, validUserId)
      ).rejects.toThrowError("Presentation not found");
    });

    it("doit lever si pas la permission de voir la présentation privée", async () => {
      const fakePres = {
        _id: validPresId,
        isPublic: false,
        authorId: otherUserId,
        toString() {
          return otherUserId;
        },
      };
      vi.spyOn(Presentation, "findById").mockResolvedValue(fakePres);

      await expect(
        viewPresentation(validPresId, validUserId)
      ).rejects.toThrowError(
        "You do not have permission to view this presentation"
      );
    }); 
  });
});
