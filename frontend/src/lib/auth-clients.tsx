import { createAuthClient } from "better-auth/react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3005";

export const authClient = createAuthClient({
  baseURL: API_BASE, 
  
  fetchOptions: {
    credentials: "include", // CRITIQUE pour les cookies cross-origin
    onError(context) {
      // Debug en dev
      if (import.meta.env.DEV) {
        console.error("Auth error:", context.error);
      }
    },
  },
});

export default authClient;