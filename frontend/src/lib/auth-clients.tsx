import { createAuthClient } from "better-auth/react";

const API_BASE =
  import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : "http://localhost:3005/api/auth";

export const authClient = createAuthClient({
  baseURL: API_BASE,
  fetchOptions: {
    credentials: "include",
  },
});
