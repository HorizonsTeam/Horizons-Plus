import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Panier_Ico from "../../assets/Panier_Ico.svg";
import Destinations_Ico from "../../assets/Destinations_Ico.svg";
import Promotions_Ico from "../../assets/Promotions_Ico.svg";
import Evenements_Ico from "../../assets/Evenement_Ico.svg";
import Reservation_ico from "../../assets/Resrvation_ico.svg";
import Carte_Reduc_Ico from "../../assets/Carte_Reduc_Ico.svg";
import Parametres_Ico from "../../assets/Parametres_Ico.svg";
import { authClient } from "../../lib/auth-clients";
import useIsMobile from "./UseIsMobile";
export type User = { name?: string; email: string; image?: string; } | null;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();
  const [QuickprofileDesktopIsOpen, setQuickprofileDesktopIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "";

  // --- session /api/me ---
  // Récupération session
  useEffect(() => {
    fetch(`${API_BASE}/api/me`, { credentials: "include" })
      .then((res) => (res.status === 401 ? null : res.json()))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setUserImage(data.user.image || null);

        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, [API_BASE]);

  const displayName = useMemo(() => {
    if (!user?.name || user.name.trim() === "") {
      return user?.email ?? "Utilisateur";
    }
    return user.name.split(" ")[0];
  }, [user]);

  const initials = displayName
    ? displayName
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2)
    : "";

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

  const menuItemsPublic = [
    { label: "Destinations", icon: Destinations_Ico, path: "/" },
    { label: "Promotions", icon: Promotions_Ico, path: "/" },
    { label: "Évènements", icon: Evenements_Ico, path: "/" },

  ];

  const menuItemsPrivate = [
    { label: "Mes réservations", icon: Reservation_ico, path: "/" },
    { label: "Panier", icon: Panier_Ico, path: "/panier" },
    { label: "Mes cartes de réduction", icon: Carte_Reduc_Ico, path: "/" },
    { label: "Paramètres", icon: Parametres_Ico, path: "/Settings" },
    { label: "Destinations", icon: Destinations_Ico, path: "/" },
    { label: "Promotions", icon: Promotions_Ico, path: "/" },
    { label: "Évènements", icon: Evenements_Ico, path: "/" },
  ];
  const menuItemsPrivateDesktop = [
    { label: "Destinations", icon: Destinations_Ico, path: "/" },
    { label: "Promotions", icon: Promotions_Ico, path: "/" },
    { label: "Évènements", icon: Evenements_Ico, path: "/" },
  ];
  const menuItemsProfileDesktop = [
    { label: "Mes réservations", icon: Reservation_ico, path: "/" },
    { label: "Mes cartes de réduction", icon: Carte_Reduc_Ico, path: "/" },
    { label: "Paramètres", icon: Parametres_Ico, path: "/Settings" },
  ];

  // Empêcher scroll quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-[#103035] sticky top-0 z-50 text-white border-b border-[#4A6367]">

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 px-4 lg:h-20 relative">

          {/* Panier mobile */}
          <Link to="/panier" className="lg:hidden absolute left-4">
            <img src={Panier_Ico} alt="Panier" className="w-7 h-7" />
          </Link>

          {/* Titre centré mobile / logo desktop */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#98EAF3] lg:text-3xl 
          absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0"
          >
            Horizons+
          </Link>
          {!isMobile && user && (
            <Link
              to="/panier"  >
              <img src={Panier_Ico} alt="Panier" className="w-7 h-7 ml-10" />
            </Link>
          )}

          {/* Menu desktop */}
          <nav className="hidden lg:flex space-x-8 items-center absolute right-4">


            {(user ? menuItemsPrivateDesktop : menuItemsPublic).map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center space-x-2 hover:text-[#98EAF3] transition-colors"
              >
                {/* <img src={item.icon} alt="" className="w-5 h-5" /> */}
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}

            {!loadingUser && !user && (
              <Link
                to="/login"
                className="border border-[#98EAF3] text-[#98EAF3] px-4 py-2 rounded-xl font-semibold hover:bg-[#98EAF3] hover:text-[#103035] transition"
              >
                Se connecter
              </Link>
            )}

            {!loadingUser && user && isMobile && (
              <button
                onClick={handleLogout}
                className="ml-4 bg-[#FFB856] text-[#115E66] font-semibold px-4 py-2 rounded-xl"
              >
                Déconnexion
              </button>
            )}

            {/* Profil connecté desktop*/}
            {!loadingUser && user && (
              <div>
                <div className="flex items-center space-x-3 ml-6 hover:cursor-pointer relative hover:text-[#98EAF3] transition-colors hover:bg-[#4A6367]  p-2 rounded-xl " onClick={() => setQuickprofileDesktopIsOpen(!QuickprofileDesktopIsOpen)}>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#98EAF3] flex items-center justify-center text-[#103035] font-bold text-lg">
                    {userImage && !imageError ? (
                      <img
                        id="header-user-image"
                        src={userImage}
                        alt="Profil"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      // Affichage des initials
                      <span>{initials}</span>
                    )}
                  </div>
                  <div className="font-bold">{displayName}</div>
                </div>

                <div>
                  <div className={`absolute top-19 right-0 z-50 ${QuickprofileDesktopIsOpen ? '' : 'hidden'}`}>
                    <div className="bg-[#103035] border border-[#4A6367] rounded-lg shadow-lg p-4 w-60 mr-2">
                      {menuItemsProfileDesktop.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={() => setQuickprofileDesktopIsOpen(false)}
                          className="flex items-center space-x-3 mb-3 hover:bg-[#4A6367] p-2 hover:rounded-xl border-b-1 border-[#4A6367]"
                        >
                          <img src={item.icon} alt="" className="w-5 h-5" />
                          <span className="font-semibold">{item.label}</span>
                        </Link>

                      ))}
                      <button
                        onClick={handleLogout}
                        className="hover:cursor-pointer bg-[#FFB856] text-[#115E66] font-semibold w-full py-2 rounded-xl"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            )}
          </nav>

          {/* Burger mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden absolute right-4 p-2"
            aria-label="Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* --- MENU MOBILE (NE REMPLACE PAS LE HEADER) --- */}
        <div
          className={`fixed top-[4.1rem] left-0 right-0 bottom-0 z-40 bg-[#103035]
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 overflow-y-auto">

            {/* Profil connecté mobile*/}
            {loadingUser ? (
              <div className="text-sm opacity-60">Chargement...</div>
            ) : user ? (
              <div className="mb-8">
                <div className="flex items-center space-x-3">
                  {/* Photo de profil ou initials */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#98EAF3] flex items-center justify-center text-[#103035] font-bold text-lg">
                    {userImage && !imageError ? (
                      <img src={userImage} alt="" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xl">{displayName}</div>
                    <div className="text-gray-300 text-sm">{user.email}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Liens */}
            <nav className="space-y-6">
              {(user ? menuItemsPrivate : menuItemsPublic).map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-4 pb-2"
                >
                  <img src={item.icon} alt="" className="w-6 h-6" />
                  <span className="text-xl font-bold">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Boutons bas */}
            <div className="mt-10 flex flex-col gap-4">
              {!loadingUser && !user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-3 bg-[#98EAF3] text-[#115E66] font-bold rounded-xl"
                  >
                    Se connecter
                  </Link>

                  <Link
                    to="/singin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-3 bg-[#FFB856] text-[#115E66] font-bold rounded-xl"
                  >
                    S’inscrire
                  </Link>
                </>
              )}

              {!loadingUser && user && (
                <button
                  onClick={handleLogout}
                  className="block w-full py-3 bg-[#FFB856] text-[#115E66] font-bold rounded-xl"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


