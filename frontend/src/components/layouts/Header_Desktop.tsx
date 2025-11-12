import { Link } from "react-router-dom";
import type { User } from "./Header";

type Props = {
    user: User;
    loadingUser: boolean;
    displayName: string;
};

export default function HeaderDesktop({ user, loadingUser, displayName }: Props) {
    return (
        <header className="bg-[#103035] sticky top-0 z-40 w-full hidden lg:block">
            <div className="px-4">
                <div className="hidden lg:flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">Horizons+</span>
                    </Link>

                    {/* Nav */}
                    <nav className="flex items-center space-x-8">
                        <Link to="/Search" className="text-white hover:text-primary transition-colors tracking-wide">
                            Search
                        </Link>
                        <Link to="/voyager" className="text-white hover:text-primary transition-colors tracking-wide">
                            Voyager
                        </Link>
                        <Link to="/contact" className="text-white hover:text-primary transition-colors tracking-wide">
                            Contact
                        </Link>
                    </nav>

                    {/* Profil */}
                    <div className="flex items-center space-x-3 text-white">
                        <div className="w-10 h-10 bg-[#2C474B] rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold text-[#98EAF3]">
                            {user ? (displayName[0] || "?").toUpperCase() : "?"}
                        </div>

                        <div className="hidden md:flex flex-col text-right text-sm leading-tight">
                            {loadingUser ? (
                                <span className="opacity-60">...</span>
                            ) : user ? (
                                <>
                                    <span className="font-semibold text-[#98EAF3]">{displayName}</span>
                                    <span className="text-gray-300 text-xs truncate max-w-[12rem]">{user.email}</span>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-[#98EAF3] hover:underline">
                                        Se connecter
                                    </Link>
                                    <Link to="/singin" className="text-[#FFB856] font-semibold hover:underline">
                                        S’inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
