// Création d'un client Better Auth coté frontend
import { createAuthClient } from "better-auth/react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3005";

export const authClient = createAuthClient({
  baseURL: API_BASE,
});