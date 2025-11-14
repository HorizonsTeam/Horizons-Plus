import { createAuthClient } from "better-auth/react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3005";

export const authClient = createAuthClient({
  baseURL: `${API_BASE}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
});