import { createAuthClient } from "better-auth/react";

const API_BASE = import.meta.env.VITE_API_URL || "";

export const authClient = createAuthClient({
  baseURL: `${API_BASE}/api/auth`, 
  
  fetchOptions: {
    credentials: "include", 
    onError(context) {
      if (import.meta.env.DEV) {
        console.error("Auth error:", context.error);
      }
    },
  },
});

export default authClient;