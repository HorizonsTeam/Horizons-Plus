import { authMiddleware } from "../../../src/middlewares/authMiddleware.js";

// Mock des dépendances externes
jest.mock("better-auth/node", () => ({
  fromNodeHeaders: jest.fn((headers) => headers),
}));

jest.mock("../../../dist/auth.js", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

// Import après les mocks pour récupérer les références mockées
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../../dist/auth.js";

// Helper pour créer des faux req/res/next
const mockReq = (headers = {}) => ({ headers });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = () => jest.fn();

describe("authMiddleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("appelle next() et attache userId si la session est valide", async () => {
    const fakeSession = { user: { id: "user-123" } };
    auth.api.getSession.mockResolvedValue(fakeSession);

    const req = mockReq({ authorization: "Bearer token" });
    const res = mockRes();
    const next = mockNext();

    await authMiddleware(req, res, next);

    expect(req.userId).toBe("user-123");
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retourne 401 si aucune session trouvée", async () => {
    auth.api.getSession.mockResolvedValue(null);

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Non autorisé" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 500 si getSession lève une erreur", async () => {
    auth.api.getSession.mockRejectedValue(new Error("DB down"));

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    expect(next).not.toHaveBeenCalled();
  });

  it("passe bien les headers à fromNodeHeaders", async () => {
    const fakeSession = { user: { id: "abc" } };
    auth.api.getSession.mockResolvedValue(fakeSession);

    const headers = { authorization: "Bearer xyz" };
    const req = mockReq(headers);
    const res = mockRes();
    const next = mockNext();

    await authMiddleware(req, res, next);

    expect(fromNodeHeaders).toHaveBeenCalledWith(headers);
  });
});