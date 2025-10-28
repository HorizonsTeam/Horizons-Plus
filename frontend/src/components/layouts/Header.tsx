import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth-clients";

import logoNavBar from "../../assets/logo-navbar.png";
import Search_Svg from "../../assets/Search_Svg.svg";
import Destination_Svg from "../../assets/Destinations_Logo.svg";
import Promotions_Svg from "../../assets/Promotion_Icon.svg";
import Events_Svg from "../../assets/Events_Eco.svg";
import Panier_Ico from "../../assets/Panier_Ico.svg";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // état utilisateur
  const [user, setUser] = useState<null | { name?: string; email: string }>(
    null
  );
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();

  // Récupère l'utilisateur connecté (session)
  useEffect(() => {
    fetch("http://localhost:3005/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.error("Erreur /api/me:", err);
        setUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  // joli prénom affiché
  const displayName = (() => {
    if (!user?.name || user.name.trim() === "") {
      return user?.email ?? "Utilisateur";
    }
    return user.name.split(" ")[0];
  })();

  // clic sur "Se déconnecter"
  const handleLogout = async () => {
    try {
      
      await authClient.signOut();
      setUser(null); // n'affiche plus l'utilisateur
      setIsMenuOpen(false); // ferme le menu burger
      navigate("/login"); // renvoie sur login
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
  };

  return (
    <>
      {/* Header principal */}
      <header className="bg-[#103035] sticky top-0 z-40">
        <div className="px-4">
          {/* Mobile header */}
          <div className="flex items-center justify-between h-16 lg:hidden ">
            {/* Panier (mobile) */}
            <div className="relative w-[27px] h-[33px] flex items-center justify-center">
              <img src={Panier_Ico} alt="Panier" className="w-full h-full" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
            </div>

            {/* Logo centré */}
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2 text-[2rem] font-bold"
              style={{ color: "#98EAF3" }}
            >
              Horizons+
            </Link>

            {/* Bouton burger */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 text-white"
              aria-label="Menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop header*/}
          <div className="hidden lg:flex items-center justify-between h-20">
            {/* Logo desktop */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                Horizons+
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="flex items-center space-x-8">
              <Link
                to="/Search"
                className="text-white hover:text-primary transition-colors tracking-wide"
              >
                Search
              </Link>

              <Link
                to="/voyager"
                className="text-white hover:text-primary transition-colors tracking-wide"
              >
                Voyager
              </Link>

              <Link
                to="/contact"
                className="text-white hover:text-primary transition-colors tracking-wide"
              >
                Contact
              </Link>
            </nav>

            {/* Profil desktop (avatar + infos) */}
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-[#2C474B] rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold text-[#98EAF3]">
                {user ? (displayName[0] || "?").toUpperCase() : "?"}
              </div>

              <div className="hidden md:flex flex-col text-right text-sm leading-tight">
                {loadingUser ? (
                  <span className="opacity-60">...</span>
                ) : user ? (
                  <>
                    <span className="font-semibold text-[#98EAF3]">
                      {displayName}
                    </span>
                    <span className="text-gray-300 text-xs truncate max-w-[12rem]">
                      {user.email}
                    </span>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[#98EAF3] hover:underline"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/singin"
                      className="text-[#FFB856] font-semibold hover:underline"
                    >
                      S’inscrire
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay fond sombre quand le ménu est ouvert (mobile) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
          style={{ backgroundColor: "rgba(16, 48, 53, 0.8)" }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Panneau burger (mobile) */}
      <div
        className={`fixed top-0 right-0 h-full w-50 bg-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#2C474B" }}
      >
        {/* barre du haut dans le menu burger */}
        <div className="flex items-center justify-end p-4 border-b border-secondary">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Logo dans le menu */}
        <img
          src={logoNavBar}
          className="mx-auto w-[15vw] -mt-6"
          alt="Horizon+ logo"
        />

        {/* Bloc user en haut du menu burger */}
        <div className="text-center text-white mt-6 mb-4">
          {loadingUser ? (
            <div className="text-sm opacity-60">...</div>
          ) : user ? (
            <>
              <div className="text-lg font-semibold text-[#98EAF3]">
                {displayName}
              </div>
              <div className="text-xs text-gray-300 break-all px-6">
                {user.email}
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold text-[#98EAF3]">
                Invité
              </div>
              <div className="text-xs text-gray-300 px-6">
                Vous n'êtes pas connecté
              </div>
            </>
          )}
        </div>

        {/* Liens de navigation dans le menu burger */}
        <nav className="space-y-4 p-6 flex flex-col items-center justify-center w-full mb-15 mt-4">
          <div className="flex items-center justify-center w-40">
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="w-50 h-10 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold"
            >
              <img src={Search_Svg} alt="Search Logo" className="w-4 h-4" />
              <span>Search</span>
            </Link>
          </div>

          <div className="flex items-center justify-center w-full max-w-md">
            <Link
              to="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="w-50 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold"
            >
              <img
                src={Destination_Svg}
                alt="Search Logo"
                className="w-4 h-4"
              />
              <span>Destinations</span>
            </Link>
          </div>

          <div className="flex items-center justify-center w-full max-w-md">
            <Link
              to="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="w-50 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold"
            >
              <img
                src={Promotions_Svg}
                alt="Search Logo"
                className="w-4 h-4"
              />
              <span>Promotions</span>
            </Link>
          </div>

          <div className="flex items-center justify-center w-full max-w-md">
            <Link
              to="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="w-50 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold"
            >
              <img src={Events_Svg} alt="Search Logo" className="w-4 h-4" />
              <span>Evenments</span>
            </Link>
          </div>
        </nav>

        {/* Boutons du bas du menu burger */}
        <div className="flex flex-col items-center gap-4 p-6 justify-center pb-16">
          {loadingUser ? (
            <div className="text-white text-sm opacity-60">...</div>
          ) : user ? (
            <>
              <button className="w-40 py-3 text-white bg-[#98EAF3] rounded-3xl text-lg font-semibold">
                <span className="text-[#115E66] font-semibold">
                  Mon compte
                </span>
              </button>

              <button
                className="w-40 py-3 text-white bg-[#FF6B6B] rounded-3xl text-lg font-semibold"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button className="w-40 py-3 text-white bg-[#98EAF3] rounded-3xl text-lg font-semibold">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#115E66] font-semibold"
                >
                  Se connecter
                </Link>
              </button>

              <button className="w-40 py-3 text-white bg-[#FFB856] rounded-3xl text-lg font-semibold">
                <Link
                  to="/singin"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#115E66]"
                >
                  S’inscrire
                </Link>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
