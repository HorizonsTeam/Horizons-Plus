import { useEffect, useMemo, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import ReturnBtn from "../../assets/ReturnBtn.svg";
import UserIco from "../../assets/userIco.svg";
import ParametresIco from "../../assets/Parametres_Ico.svg";
import PaiementIco from "../../assets/PaiementIco.svg";
import PreferenceIco from "../../assets/PreferencesIco.svg";
import NotificationIco from "../../assets/NotificationsIco.svg";
import SecuIco from "../../assets/SecuIco.svg";

import useIsMobile from "../../components/layouts/UseIsMobile";
import UserProfileForm from "./components/UserInformation/UserProfileForm";
import UserAdressForm from "./components/UserInformation/UserAdressForm";
import AccountSettings from "./Pages/AccountSettings/AccountSettings";

type User = {
    name?: string;
    email: string;
    phone?: string;
    birthDate?: string;
    address?: {
        street?: string;
        city?: string;
        zipCode?: string;
        country?: string;
    };
};

type SettingKey =
    | "ProfilInfo"
    | "AccountSettings"
    | "Preferences"
    | "Payments"
    | "Notifications"
    | "Security";

export default function Setings(): JSX.Element {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const [selectedSetting, setSelectedSetting] = useState<SettingKey>("ProfilInfo");
    const [profileTab, setProfileTab] = useState<"profil" | "adresse">("profil");

    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const API_BASE = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        fetch(`${API_BASE}/api/me`, { credentials: "include" })
            .then((res) => (res.status === 401 ? null : res.json()))
            .then((data: any) => setUser((data?.user ?? null) as User | null))
            .catch(() => setUser(null))
            .finally(() => setLoadingUser(false));
    }, [API_BASE]);

    const informationProfile = useMemo<boolean>(() => selectedSetting === "ProfilInfo", [selectedSetting]);

    const handleRetour = (): void => {
        navigate(-1);
    };

    const SidebarItem = ({
        icon,
        label,
        active,
        onClick,
    }: {
        icon: string;
        label: string;
        active: boolean;
        onClick: () => void;
    }): JSX.Element => (
        <button
            type="button"
            onClick={onClick}
            className="w-full border-b-2 border-[#2C474B] h-20"
        >
            <div className="w-full flex justify-start items-center gap-4">
                <img src={icon} alt="" className="h-6 w-8" />
                <p className={`text-xl font-bold ${active ? "text-[#98EAF3]" : ""}`}>{label}</p>
            </div>
        </button>
    );

    if (loadingUser && !isMobile) {
        return <div className="w-full p-4">Chargement des informations...</div>;
    }

    return (
        <div className={`${isMobile ? "w-full flex justify-center" : "w-full flex justify-start gap-5 p-4"}`}>
            <div className={`w-full ${!isMobile ? "max-w-[420px]" : ""}`}>
                <div className="relative mt-4 flex justify-center items-center m-2">
                    <button type="button" onClick={handleRetour}>
                        <img
                            src={ReturnBtn}
                            alt="Return Button"
                            className={`absolute left-1 mt-5 transform -translate-y-1/2 ${isMobile ? "max-w-10" : ""}`}
                        />
                    </button>
                    <h1 className="text-3xl text-[#98EAF3] font-medium text-center">Paramètres</h1>
                </div>

                <div className="w-full px-4 mt-14">
                    <div className="w-full flex flex-col">
                        <SidebarItem
                            icon={UserIco}
                            label="Informations du profil"
                            active={informationProfile && !isMobile}
                            onClick={() => {
                                if (isMobile) navigate("/UserInfoPageMobile");
                                else setSelectedSetting("ProfilInfo");
                            }}
                        />

                        <SidebarItem
                            icon={ParametresIco}
                            label="Paramètres du compte"
                            active={selectedSetting === "AccountSettings" && !isMobile}
                            onClick={() => {
                                if (isMobile) navigate("/AccountSettings");
                                else setSelectedSetting("AccountSettings");
                            }}
                        />

                        <SidebarItem
                            icon={PreferenceIco}
                            label="Préférences"
                            active={selectedSetting === "Preferences" && !isMobile}
                            onClick={() => {
                                if (isMobile) navigate("/Preferences");
                                else setSelectedSetting("Preferences");
                            }}
                        />

                        <SidebarItem
                            icon={PaiementIco}
                            label="Paiements"
                            active={selectedSetting === "Payments" && !isMobile}
                            onClick={() => {
                                if (isMobile) navigate("/Payments");
                                else setSelectedSetting("Payments");
                            }}
                        />

                        <SidebarItem
                            icon={NotificationIco}
                            label="Notifications"
                            active={selectedSetting === "Notifications" && !isMobile}
                            onClick={() => {
                                if (isMobile) navigate("/Notifications");
                                else setSelectedSetting("Notifications");
                            }}
                        />

                        <button type="button" className="w-full h-20">
                            <div className="w-full flex justify-start items-center gap-4">
                                <img src={SecuIco} alt="" className="h-6 w-8" />
                                <p className={`text-xl font-bold ${selectedSetting === "Security" && !isMobile ? "text-[#98EAF3]" : ""}`}>
                                    Sécurité
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="mt-10 h-14 bg-[#FFB856] text-[#115E66] font-semibold px-4 rounded-xl"
                            onClick={() => {
                                // TODO: brancher ton endpoint logout + navigate
                                navigate("/");
                            }}
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {!isMobile && (
                <div className="w-full m-4">
                    {selectedSetting === "ProfilInfo" && (
                        <>
                            <div className="flex w-full justify-center h-20 mt-10">
                                <button
                                    type="button"
                                    className={`w-full text-2xl font-semibold border-b-4 rounded-tr-3xl transition-colors duration-300 ${profileTab === "profil"
                                            ? "bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]"
                                            : "bg-transparent border-b-white"
                                        }`}
                                    onClick={() => setProfileTab("profil")}
                                >
                                    Profil
                                </button>

                                <button
                                    type="button"
                                    className={`w-full text-2xl font-semibold border-b-4 rounded-tl-3xl transition-colors duration-300 ${profileTab === "adresse"
                                            ? "bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]"
                                            : "bg-transparent border-b-white"
                                        }`}
                                    onClick={() => setProfileTab("adresse")}
                                >
                                    Adresse
                                </button>
                            </div>

                            {profileTab === "profil" && (
                                <div className="mt-20">
                                    <UserProfileForm
                                        initialData={{
                                            firstName: user?.name?.split(" ")[0] ?? "",
                                            lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
                                            birthDate: user?.birthDate ?? "",
                                            phone: user?.phone ?? "",
                                            email: user?.email ?? "",
                                        }}
                                    />
                                </div>
                            )}

                            {profileTab === "adresse" && (
                                <div className="mt-20">
                                    <UserAdressForm initialData={user?.address} />
                                </div>
                            )}
                        </>
                    )}

                    {selectedSetting === "AccountSettings" && (
                        <div className="mt-10">
                            <AccountSettings />
                        </div>
                    )}

                    {selectedSetting !== "ProfilInfo" && selectedSetting !== "AccountSettings" && (
                        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                            <p className="text-lg font-semibold">Bientôt disponible</p>
                            <p className="text-sm opacity-80 mt-1">Cette section n’est pas encore implémentée.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
