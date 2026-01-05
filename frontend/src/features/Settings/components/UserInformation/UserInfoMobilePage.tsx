import { useState } from 'react';
import UserProfileForm from '../../components/UserInformation/UserProfileForm';
import UserAdressForm from './UserAdressForm';
import { useEffect } from 'react';



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

export default function UserInfoPageMobile() {
    const [profileInfoDesplay, setProfileInfoDesplay] = useState(true);
    const [AdresseInfoDesplay, setAdresseInfoDesplay] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetch(`${API_BASE}/api/me`, { credentials: 'include' })
            .then((res) => (res.status === 401 ? null : res.json()))
            .then((data) => setUser(data?.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoadingUser(false));
    }, [API_BASE]);

    if (loadingUser) {
        return <div className="w-full p-2">Chargement...</div>;
    }

    return (
        <div className="w-full p-2">
            <div className="flex w-full justify-center h-20 mt-10 ">
                <button
                    className={`w-full  text-2xl font-semibold border-b-4 rounded-tr-3xl transition-colors duration-300 ${!profileInfoDesplay
                        ? 'bg-transparent border-b-white '
                        : 'bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]'
                        }`}
                    onClick={() => {
                        setProfileInfoDesplay(true);
                        setAdresseInfoDesplay(false);
                    }}
                >
                    Profil
                </button>

                <button
                    className={` w-full text-2xl font-semibold border-b-4 rounded-tl-3xl transition-colors duration-300 ${!profileInfoDesplay
                        ? 'bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]'
                        : 'bg-transparent border-b-white '
                        }`}
                    onClick={() => {
                        setProfileInfoDesplay(false);
                        setAdresseInfoDesplay(true);
                    }}
                >
                    Adresse
                </button>
            </div>

            {profileInfoDesplay && (
                <div className="mt-20">
                    <UserProfileForm
                        initialData={{
                            firstName: user?.name?.split(' ')[0] ?? "",  
                            lastName: user?.name?.split(' ').slice(1).join(' ') ?? "",  
                            birthDate: user?.birthDate ?? "",
                            phone: user?.phone ?? "",
                            email: user?.email ?? "",
                        }}
                    />
                </div>
            )}

            {AdresseInfoDesplay && (
                <div className="mt-20">
                    {/* On envoie l'adresse au form d’adresse */}
                    <UserAdressForm initialData={user?.address} />
                </div>
            )}
        </div>
    );
}