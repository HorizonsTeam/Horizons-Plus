// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Panier_Ico from "../../assets/Panier_Ico.svg";
// import Destinations_Ico from "../../assets/Destinations_Ico.svg";
// import Promotions_Ico from "../../assets/Promotions_Ico.svg";
// import Evenements_Ico from "../../assets/Evenement_Ico.svg";
// import Reservation_ico from "../../assets/Resrvation_ico.svg";
// import Carte_Reduc_Ico from "../../assets/Carte_Reduc_Ico.svg";
// import Parametres_Ico from "../../assets/Parametres_Ico.svg";
// import { authClient } from "../../lib/auth-clients";


// export type User = { name?: string; email: string } | null;

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState<User>(null);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const navigate = useNavigate();

//   // --- Récupération de la session ---
//   useEffect(() => {
//     fetch("http://localhost:3005/api/me", { credentials: "include" })
//       .then((res) => (res.status === 401 ? null : res.json()))
//       .then((data) => setUser(data?.user ?? null))
//       .catch(() => setUser(null))
//       .finally(() => setLoadingUser(false));
//   }, []);

//   const displayName = useMemo(() => {
//     if (!user?.name || user.name.trim() === "") {
//       return user?.email ?? "Utilisateur";
//     }
//     return user.name.split(" ")[0];
//   }, [user]);

//   const initials = displayName
//     ? displayName
//         .split(" ")
//         .map((w) => w[0]?.toUpperCase())
//         .join("")
//         .slice(0, 2)
//     : "";

//   //Déconnexion utilisateur
//   const handleLogout = async () => {
//     try {
//       await authClient.signOut();
//       setUser(null);
//       setIsMenuOpen(false);
//       navigate("/login");
//     } catch (err) {
//       console.error("Erreur déconnexion:", err);
//     }
//   };

//   //Liens publics (non connecté)
//   const menuItemsPublic = [
//     { label: "Destinations", icon: Destinations_Ico, path: "/" },
//     { label: "Promotions", icon: Promotions_Ico, path: "/" },
//     { label: "Évènements", icon: Evenements_Ico, path: "/" },
//     { label: "Panier", icon: Panier_Ico, path: "/panier" },
//   ];

//   //Liens connectés
//   const menuItemsPrivate = [
//     { label: "Mes réservations", icon: Reservation_ico, path: "/" },
//     { label: "Panier", icon: Panier_Ico, path: "/panier" },
//     { label: "Mes cartes de réduction", icon: Carte_Reduc_Ico, path: "/" },
//     { label: "Paramètres", icon: Parametres_Ico, path: "/" },
//     { label: "Destinations", icon: Destinations_Ico, path: "/" },
//     { label: "Promotions", icon: Promotions_Ico, path: "/" },
//     { label: "Évènements", icon: Evenements_Ico, path: "/" },
//   ];

//   // --- Empêche scroll sur mobile quand menu ouvert ---
//   useEffect(() => {
//     document.body.style.overflow = isMenuOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isMenuOpen]);

//   return (
//     <header className="bg-[#103035] sticky top-0 z-50 text-white border-b border-[#4A6367]">
//       {/* --- Barre du haut --- */}
//       <div className="flex items-center justify-between h-16 px-4 lg:h-20 ">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-2xl font-bold text-[#98EAF3] lg:text-3xl"
//         >
//           Horizons+
//         </Link>

//         {/* Menu desktop */}
//         <nav className="hidden lg:flex space-x-8 items-center">
//           {(user ? menuItemsPrivate : menuItemsPublic).map((item) => (
//             <Link
//               key={item.label}
//               to={item.path}
//               className="flex items-center space-x-2 hover:text-[#98EAF3] transition-colors"
//             >
//               <img src={item.icon} alt="" className="w-5 h-5" />
//               <span className="font-semibold">{item.label}</span>
//             </Link>
//           ))}

//           {!loadingUser && !user && (
//             <>
//               <Link to="/login" className="border border-[#98EAF3] text-[#98EAF3] px-4 py-2 rounded-xl font-semibold hover:bg-[#98EAF3] hover:text-[#103035] transition">
//                 Se connecter
//               </Link>
//               {/* <Link to="/singin" className="text-[#FFB856] font-bold">
//                 S’inscrire
//               </Link> */}
//             </>
//           )}
//           {!loadingUser && user && (
//             <button
//               onClick={handleLogout}
//               className="ml-4 bg-[#FFB856] text-[#115E66] font-semibold px-4 py-2 rounded-xl"
//             >
//               Déconnexion
//             </button>
//           )}
//         </nav>

//         {/* Profil / burger mobile */}
//         <div className="lg:hidden flex items-center space-x-3">
//           {/* Panier icône mobile */}
//           <Link to="/panier">
//             <img src={Panier_Ico} alt="Panier" className="w-7 h-7" />
//           </Link>

//           {/* Burger */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-2 text-white"
//             aria-label="Menu"
//           >
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isMenuOpen ? (
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               ) : (
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* --- Menu mobile plein écran --- */}
//       <div
//         className={`fixed inset-0 z-40 bg-[#103035] transform transition-transform duration-300 ease-in-out lg:hidden ${
//           isMenuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* En-tête menu */}
//         <div className="flex items-center justify-between p-4">
//           <span className="text-3xl font-bold text-[#98EAF3]">Horizons+</span>
//           <button
//             onClick={() => setIsMenuOpen(false)}
//             className="p-2 text-white"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Contenu menu */}
//         <div className="p-6 overflow-y-auto">
//           {loadingUser ? (
//             <div className="text-sm opacity-60">Chargement...</div>
//           ) : user ? (
//             <div className="mb-8">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-[#98EAF3] w-10 h-10 rounded-full flex items-center justify-center text-[#103035] font-bold">
//                   {initials}
//                 </div>
//                 <div>
//                   <div className="font-bold text-xl">{displayName}</div>
//                   <div className="text-gray-300 text-sm">{user.email}</div>
//                 </div>
//               </div>
//             </div>
//           ) : null}

//           <nav className="space-y-6">
//             {(user ? menuItemsPrivate : menuItemsPublic).map((item) => (
//               <Link
//                 key={item.label}
//                 to={item.path}
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`flex items-center space-x-4 pb-2 ${
//                   item.label === "Panier" ? "border-t border-[#4A6367] pt-3" : ""
//                 }`}
//               >
//                 <img src={item.icon} alt="" className="w-6 h-6" />
//                 <span className="text-xl font-bold">{item.label}</span>
//               </Link>
//             ))}
//           </nav>

//           {/* Boutons bas du menu */}
//           <div className="mt-10 flex flex-col gap-4">
//             {!loadingUser && !user && (
//               <>
//                 <Link
//                   to="/login"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="block text-center py-3 bg-[#98EAF3] text-[#115E66] font-bold rounded-xl"
//                 >
//                   Se connecter
//                 </Link>
//                 <Link
//                   to="/singin"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="block text-center py-3 bg-[#FFB856] text-[#115E66] font-bold rounded-xl"
//                 >
//                   S’inscrire
//                 </Link>
//               </>
//             )}
//             {!loadingUser && user && (
//               <button
//                 onClick={handleLogout}
//                 className="block w-full py-3 bg-[#FFB856] text-[#115E66] font-bold rounded-xl"
//               >
//                 Déconnexion
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



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

export type User = { name?: string; email: string } | null;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3005";
  
  // --- session /api/me ---
  // Récupération session
  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    fetch(`${API_URL}/api/me`, { credentials: "include" })
      .then((res) => (res.status === 401 ? null : res.json()))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

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
    { label: "Panier", icon: Panier_Ico, path: "/panier" },
  ];

  const menuItemsPrivate = [
    { label: "Mes réservations", icon: Reservation_ico, path: "/" },
    { label: "Panier", icon: Panier_Ico, path: "/panier" },
    { label: "Mes cartes de réduction", icon: Carte_Reduc_Ico, path: "/" },
    { label: "Paramètres", icon: Parametres_Ico, path: "/" },
    { label: "Destinations", icon: Destinations_Ico, path: "/" },
    { label: "Promotions", icon: Promotions_Ico, path: "/" },
    { label: "Évènements", icon: Evenements_Ico, path: "/" },
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

        {/* Menu desktop */}
        <nav className="hidden lg:flex space-x-8 items-center absolute right-4">
          {(user ? menuItemsPrivate : menuItemsPublic).map((item) => (
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

          {!loadingUser && user && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-[#FFB856] text-[#115E66] font-semibold px-4 py-2 rounded-xl"
            >
              Déconnexion
            </button>
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

          {/* Profil connecté */}
          {loadingUser ? (
            <div className="text-sm opacity-60">Chargement...</div>
          ) : user ? (
            <div className="mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-[#98EAF3] w-10 h-10 rounded-full flex items-center justify-center text-[#103035] font-bold">
                  {initials}
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


