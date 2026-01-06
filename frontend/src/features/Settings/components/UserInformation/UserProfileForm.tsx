import useIsMobile from "../../../../components/layouts/UseIsMobile";
import { useState, useEffect } from "react";
import authClient from "../../../../lib/auth-clients";

type UserProfileFormProps = {
    initialData?: {
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        phone?: string;
        email?: string;
    };
    onChangeImage?: (newUrl: string) => void;
};

export default function UserProfileForm({ initialData, onChangeImage }: UserProfileFormProps) {
    const isMobile = useIsMobile();
    const { refetch } = authClient.useSession();

    const [form, setForm] = useState({
        firstName: initialData?.firstName ?? "",
        lastName: initialData?.lastName ?? "",
        birthDate: initialData?.birthDate ?? "",
        phone: initialData?.phone ?? "",
        email: initialData?.email ?? "",
    });


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log("Fichier sélectionné:", file.name);

        // Upload vers ton backend 
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:3005/api/upload-avatar", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!res.ok) {
                console.error("Erreur upload:", res.statusText);
                return;
            }

            const data = await res.json();
            const imageUrl = data.url;

            // Mise à jour Better Auth
            await authClient.updateUser({ image: imageUrl });

            // Rafraîchissement de la session
            await refetch();

            if (onChangeImage) onChangeImage(imageUrl);

            console.log("Image de profil mise à jour avec succès");

        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        if (initialData) {
            setForm({
                firstName: initialData.firstName ?? "",
                lastName: initialData.lastName ?? "",
                birthDate: initialData.birthDate ?? "",
                phone: initialData.phone ?? "",
                email: initialData.email ?? "",
            });
        }
    }, [initialData]);



    const NoData = !form.firstName && !form.lastName && !form.birthDate && !form.phone;
    return (
        <div className="w-full p-4">

            {/* Aucune information saisie */}
            {NoData && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-center">
                    <p className="text-yellow-800 font-semibold">
                        Aucune information de profil saisie
                    </p>
                    <p className="text-sm text-yellow-700">
                        Remplissez les champs pour compléter votre profil
                    </p>
                </div>
            )}

            <div className={`border-b-2 border-b-[#4A6367] flex justify-between items-center  h-20 px-2 pb-2`}>
                <p className="text-xl font-semibold">Photo de profil</p>

                <label className="bg-transparent border-3 border-white text-white px-3 py-1 rounded-xl cursor-pointer hover:bg-white hover:text-black transition">
                    Importer
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            <div className={`border-b-2 border-b-[#4A6367] flex ${isMobile ? 'w-80' : 'w-full'}justify-between gap-20 items-center h-30 px-2 py-5 pb-2`}>
                <p className="text-xl w-30 font-semibold">Prénom</p>
                <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className={`w-full bg-[#2C474B] ${isMobile ? 'min-w-30 max-w-40' : ''} h-15 p-4 rounded-xl`}
                />


            </div>
            <div className={`border-b-2 border-b-[#4A6367] flex ${isMobile ? 'w-80' : 'w-full'}justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2`}>
                <p className="text-xl w-30 font-semibold">Nom</p>
                <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className={`w-full bg-[#2C474B] ${isMobile ? 'min-w-30 max-w-40' : ''} h-15 p-4 rounded-xl`}
                />


            </div>
            <div className={`border-b-2 border-b-[#4A6367] flex ${isMobile ? 'w-80' : 'w-full'} justify-between gap-18 items-center w-full h-30 px-2 py-5 pb-2 relative`}>
                <p className="text-xl w-25 font-semibold">Date de naissance</p>
                <input
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className={`w-full bg-[#2C474B] ${isMobile ? 'min-w-30 max-w-40' : ''} h-15 p-4 rounded-xl`}
                    placeholder={!form.birthDate ? "Non renseignée" : ""}
                />
            </div>

            <div className={` flex ${isMobile ? 'w-80' : 'w-full'}justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2`}>
                <p className="text-xl w-30 font-semibold">Numéro</p>
                <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full bg-[#2C474B] ${isMobile ? 'min-w-30 max-w-40' : ''} h-15 p-4 rounded-xl`}
                    placeholder={!form.phone ? "Non renseignée" : ""}
                />


            </div>
        </div>
    );
}
