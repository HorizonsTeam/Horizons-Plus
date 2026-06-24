jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: { upload: jest.fn() },
  },
}));

jest.mock("multer-storage-cloudinary", () => ({
  CloudinaryStorage: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("multer", () => {
  const multerMock = jest.fn().mockImplementation(() => ({
    single: jest.fn().mockReturnValue((req, res, next) => {
      // Par défaut pas de fichier — chaque test peut surcharger req.file
      next();
    }),
  }));
  return multerMock;
});

jest.mock("../../../dist/auth.js", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/upload.js";
import { prisma } from "../../../dist/auth.js";

// --- app de test ---
const app = express();
app.use(express.json());

// Middleware pour injecter req.userId et req.file depuis les headers de test
app.use((req, res, next) => {
  req.userId = req.headers["x-user-id"] || null;
  if (req.headers["x-mock-file"] === "true") {
    req.file = { path: "https://res.cloudinary.com/test/avatars/user.jpg" };
  }
  next();
});

app.use("/", router);

// --- fixtures ---
const asUser = { "x-user-id": "user-123" };
const withFile = { ...asUser, "x-mock-file": "true" };

const fakeUser = {
  id: "user-123",
  name: "Alice",
  email: "alice@test.com",
  image: null,
};

const fakeUpdatedUser = {
  ...fakeUser,
  image: "https://res.cloudinary.com/test/avatars/user.jpg",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("POST /upload-avatar", () => {
  describe("validation", () => {
    it("retourne 400 si aucun fichier n'est reçu", async () => {
      // pas de header x-mock-file → req.file undefined
      const res = await request(app)
        .post("/upload-avatar")
        .set(asUser);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Fichier non reçu par Multer");
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("retourne 404 si l'utilisateur n'existe pas en BDD", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/upload-avatar")
        .set(withFile);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Utilisateur introuvable dans la base de données");
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("cas nominal", () => {
    it("retourne success:true et l'URL cloudinary si tout se passe bien", async () => {
      prisma.user.findUnique.mockResolvedValue(fakeUser);
      prisma.user.update.mockResolvedValue(fakeUpdatedUser);

      const res = await request(app)
        .post("/upload-avatar")
        .set(withFile);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        url: "https://res.cloudinary.com/test/avatars/user.jpg",
      });
    });

    it("cherche l'utilisateur avec le bon userId", async () => {
      prisma.user.findUnique.mockResolvedValue(fakeUser);
      prisma.user.update.mockResolvedValue(fakeUpdatedUser);

      await request(app).post("/upload-avatar").set(withFile);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
    });

    it("met à jour l'image avec le bon userId et la bonne URL", async () => {
      prisma.user.findUnique.mockResolvedValue(fakeUser);
      prisma.user.update.mockResolvedValue(fakeUpdatedUser);

      await request(app).post("/upload-avatar").set(withFile);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { image: "https://res.cloudinary.com/test/avatars/user.jpg" },
      });
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 si findUnique lève une erreur", async () => {
      prisma.user.findUnique.mockRejectedValue(new Error("DB crash"));

      const res = await request(app)
        .post("/upload-avatar")
        .set(withFile);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB crash");
    });

    it("retourne 500 si update lève une erreur", async () => {
      prisma.user.findUnique.mockResolvedValue(fakeUser);
      prisma.user.update.mockRejectedValue(new Error("Update failed"));

      const res = await request(app)
        .post("/upload-avatar")
        .set(withFile);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Update failed");
    });
  });
});