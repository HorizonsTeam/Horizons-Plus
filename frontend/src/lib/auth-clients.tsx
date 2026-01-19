import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins"

const API_BASE = import.meta.env.VITE_API_URL || "";

export const authClient = createAuthClient({
  baseURL: `${API_BASE}/api/auth`, 
  plugins: [twoFactorClient()],
  
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