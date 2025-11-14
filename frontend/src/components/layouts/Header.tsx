import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-clients";
import HeaderDesktop from "./Header_Desktop";
import HeaderMobile from "./Header_Mobile";


// Types
export type User = { name?: string; email: string } | null;


export default function Header() {
  // --- état global ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3005";

  // --- session /api/me ---
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.status === 401 ? null : res.json()))
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setLoadingUser(false));
  }, []);
  // phase test - à décommenter
  //   fetch(`${API_URL}/api/me`, { credentials: "include" })
  //     .then((res) => (res.status === 401 ? null : res.json()))
  //     .then((data) => setUser(data?.user ?? null))
  //     .catch((err) => {
  //       console.error("Erreur /api/me:", err);
  //       setUser(null);
  //     })
  //     .finally(() => setLoadingUser(false));
  // }, []);

  // --- displayName ---
  const displayName = useMemo(() => {
    if (!user?.name || user.name.trim() === "") {
      return user?.email ?? "Utilisateur";
    }
    return user.name.split(" ")[0];
  }, [user]);

  // --- logout ---
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setIsMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
  };

  return (
    <>
      {/* Desktop */}
      <HeaderDesktop
        user={user}
        loadingUser={loadingUser}
        displayName={displayName}
      />

      {/* Mobile */}
      <HeaderMobile
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        loadingUser={loadingUser}
        displayName={displayName}
        onLogout={handleLogout}
      />
    </>
  );
}
