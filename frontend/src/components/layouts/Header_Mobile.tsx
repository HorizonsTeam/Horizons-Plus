import { Link } from "react-router-dom";
import type { User } from "./Header";
import { useEffect } from "react";
import Menu_items_Connecter from '../connected/MenuItems_Connecter'
import Panier_Ico from "../../assets/Panier_Ico.svg";
import Destinations_Ico from "../../assets/Destinations_Ico.svg";
import Promotions_Ico from "../../assets/Promotions_Ico.svg";
import Evenements_Ico from "../../assets/Evenement_Ico.svg";
import Parametres_Ico from "../../assets/Parametres_Ico.svg";



type Props = {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
    loadingUser: boolean;
    displayName: string;
    onLogout: () => void;
};

export default function HeaderMobile({
    isMenuOpen,
    setIsMenuOpen,
    user,
    loadingUser,
    displayName,
    onLogout,
}: Props) 
{
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);


    return (
        <>
            <header className="bg-[#103035] sticky top-0 z-40 w-full lg:hidden">
                <div className="">
                    <div className="flex items-center justify-between h-16">
                        {/* Panier */}
                        <Link to="/panier">
                            <div className="relative w-[27px] h-[33px] flex items-center justify-center ml-7 ">
                                <img src={Panier_Ico} alt="Panier" className="w-full h-full -ml-5" />
                            </div>
                        </Link>
                        {/* Logo */}
                        <Link
                            to="/"
                            className="absolute left-1/2 transform -translate-x-1/2 text-[2rem] font-bold"
                            style={{ color: "#98EAF3" }}
                        >
                            Horizons+
                        </Link>

                        {/* Burger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-white z-50 "
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
                </div>
            </header>

            
            {/* Menu plein écran */}
            <div
                className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ backgroundColor: "#2C474B" }}
                role="dialog"
                aria-modal="true"
            >
                {/* barre du haut */}
                <div className="flex items-center justify-between  p-4 border-b border-b-3 border-[#4A6367]">
                    <span className="text-4xl font-bold text-[#98EAF3] ml-25 ">Horizons+</span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-white hover:text-primary transition-colors"
                        aria-label="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* contenu scrollable si besoin */}
                <div className="h-[calc(100vh-56px)] overflow-y-auto items-left">
                    
                    {/* Logo */}
                    

                    {/* User block */}
                    <div className="text-center text-white mt-6 mb-4">
                        {loadingUser ? (
                            <div className="text-sm opacity-60">...</div>
                        ) : user ? (
                            <>
                                <div className="text-lg font-semibold text-[#98EAF3]">{displayName}</div>
                                <div className="text-xs text-gray-300 break-all px-6">{user.email}</div>
                            </>
                        ) : (
                            <>
                            <div className="bg-[#98EAF3] w-10 h-10 rounded-full flex items-center justify-center text-center">
                                <div className="text-lg font-semibold text-white">PD</div>
                                
                            </div>
                            <div className="text-xs text-gray-300 px-6">Vous n&apos;êtes pas connecté</div>
                             </>
                        )}
                    </div>

                    {/* Links */}
                    <nav className="grid grid-cols ">
                        <Menu_items_Connecter/>
                        
                        
                    </nav>
                    <nav>
                        <div className="flex display-flex border-b-3 border-[#4A6367] w-80 ml-10  mt-5">
                            <div className="grid grid-cols gap-8  mb-5  mt-2 w-10">
                                <img src={Destinations_Ico} alt="" />
                                <img src={Promotions_Ico} alt="" />
                                <img src={Evenements_Ico} alt="" />

                            </div>
                            <div className="grid grid-cols gap-8  w-full items-left mb-5">
                                <Link to="/" className="text-left font-bold text-xl"> <span>Destinations</span> </Link>
                                <Link to="/" className="text-left text-xl font-bold"> Promotions</Link>
                                <Link to="/" className="text-left font-bold text-xl ">Évènements</Link>
                            </div>





                        </div>
                    </nav>
                    <nav>
                        <div className="flex display-flex  w-80 ml-10  mt-5">
                            <div className="grid grid-cols gap-8  mb-5  mt-2 w-10">

                                <img src={Parametres_Ico} alt="" />

                            </div>
                            <div className="grid grid-cols gap-8  w-full items-left mb-5">
                                <Link to="/" className="text-left font-bold text-xl"> <span>Paramètres</span> </Link>

                            </div>
                        </div>

                    </nav>

                    {/* Bottom buttons */}
                    <div className="flex flex-col items-center gap-4 p-6 justify-center pb-16">
                        {loadingUser ? (
                            <div className="text-white text-sm opacity-60">...</div>
                        ) : user ? (
                            <>
                                <button className="w-40 py-3 text-white bg-[#98EAF3] rounded-3xl text-lg font-semibold">
                                    <span className="text-[#115E66] font-semibold">Mon compte</span>
                                </button>

                                <button
                                    className="w-40 py-3 text-white bg-[#FF6B6B] rounded-3xl text-lg font-semibold"
                                    onClick={onLogout}
                                >
                                    Se déconnecter
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="w-40 py-3 text-white bg-[#98EAF3] rounded-3xl text-lg font-semibold">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[#115E66] font-semibold">
                                        Se connecter
                                    </Link>
                                </button>

                                <button className="w-40 py-3 text-white bg-[#FFB856] rounded-3xl text-lg font-semibold">
                                    <Link to="/singin" onClick={() => setIsMenuOpen(false)} className="text-[#115E66]">
                                        S’inscrire
                                    </Link>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>


            </>
    );
}
