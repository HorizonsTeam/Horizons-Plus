import Gender_Selection from './Gender';
import { useState } from 'react';
import CarteReduction from './Carte_De_Reduction'
import closeSvg from '../../../../../assets/CloseSVG.svg'
import type { User } from '../../components/paiement/Types/Types';


type Props = {
    passagerIndex?: number;
    suprimer_Passager?: () => void;
    onChange: (data: User) => void;
};

export default function Passagers_Data_Form({ passagerIndex, suprimer_Passager, onChange }: Props) 
{      
    const [Abonement_Reduction, setAbonement_reduc] = useState(false);
    const fermer = () => {
        setAbonement_reduc(false);
    }
    const [formData, setFormData] = useState<User>({
        Nom: "",
        Prenom: "",
        BirthDate: "",
        Sexe: "Homme",
        Email: ""
    });


    const titre = passagerIndex === 1
        ? "Vos informations"
        : ` Informations du passager  ${passagerIndex}`;

    const [selectedGender, setSelectedGender] = useState("Homme");

    // State pour stocker les données
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        birthdate: "",
        email: "",
        phone: "",
        gender: selectedGender
    });

    const updateField = (field: string, value: string) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        onChange(updated);
    };

    return (

        <>
            <div className="w-full items-center bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 p-4">
                <div className='w-full flex justify-between mb-5'>
                    <p className={`font-bold mt-4 ${passagerIndex === 1 && 'w-full text-center  '}`}>{titre}</p>
                    {passagerIndex !== 1 && (
                        <button className="font-bold text-xl text-red" onClick={suprimer_Passager}>
                            <img src={closeSvg} alt="" className='w-6 h-6 mt-4' />
                        </button>
                    )}
                </div>
            <div className="w-full mt-2 border-t-2 border-[#2C474B] ">
                <div className="flex  mt-4 mb-4">
                    <Gender_Selection
                        value="Homme"
                        IsSelected={selectedGender === "Homme"}
                            onClick={() => {
                                setSelectedGender("Homme");
                                setFormData({ ...formData, Sexe: "Homme" });
                                onChange({ ...formData, Sexe: "Homme" });
                            }}
                    />

                    <Gender_Selection
                        value="Femme"
                        IsSelected={selectedGender === "Femme"}
                            onClick={() => {
                                setSelectedGender("Femme");
                                setFormData({ ...formData, Sexe: "Femme" });
                                onChange({ ...formData, Sexe: "Femme" });
                            }}
                    />

                    <Gender_Selection
                        value="Autre"
                        IsSelected={selectedGender === "Autre"}
                            onClick={() => {
                                setSelectedGender("Autre");
                                setFormData({ ...formData, Sexe: "Autre" });
                                onChange({ ...formData, Sexe: "Autre" });
                            }}
                    />
                </div>
            <div className="grid grid-cols-[1fr_2fr]  mt-8 mb-8">
                <div className="grid grid-cols  gap-10 mt-4">

                    <label className="text-white">Prénom <span className='font-bold text-[#FFB856]'>*</span></label>
                    <label className="text-white">Nom <span className='font-bold text-[#FFB856]'>*</span></label>
                    <label className="text-white w-full ">Date de naissance  <span className='font-bold text-[#FFB856]'>*</span></label>
                    <label className="text-white">Email <span className='font-bold text-[#FFB856]'>*</span></label>
                    <label className="text-white">Num <span className='font-bold text-[#FFB856]'>*</span></label>
                </div>
                <div className='grid grid-cols gap-10 '>
                            <input type="text" value={formData.Prenom}   onChange={(e) => { const updated = { ...formData, Prenom: e.target.value }; setFormData(updated); onChange(updated);}} className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />


                            <input type="text"
                                value={formData.Nom}
                                onChange={(e) => {
                                    const updated = { ...formData, Nom: e.target.value };
                                    setFormData(updated);
                                    onChange(updated);
                                }} className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />


                            <input
                                type="date"
                                value={formData.BirthDate}
                                onChange={(e) => {
                                    const updated = { ...formData, BirthDate: e.target.value };
                                    setFormData(updated);
                                    onChange(updated);
                                }}
                                className="h-13 rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full input-date-white"
                                value={formData.birthdate}
                                onChange={(e) => updateField("birthdate", e.target.value)}
                            />
                            <input type="email"
                                value={formData.Email}
                                onChange={(e) => {
                                    const updated = { ...formData, Email: e.target.value };
                                    setFormData(updated);
                                    onChange(updated);
                                }} className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />
                    <input type="tel" className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />


                </div>
                {!Abonement_Reduction ? (
                    <div className="w-full items-center bg-[#103035] rounded-2xl border-2 border-[#2C474B] mt-5  p-4">
                        <button className='w-full' onClick={() => setAbonement_reduc(!Abonement_Reduction)}
                        >
                            <div className='flex justify-between'>
                                <p className="font-bold mt-1 text-xs ">Carte de réduction / abonnement</p>
                                <div className='h-8 w-8 bg-white rounded-2xl flex justify-center items-center '>
                                    <h1 className='text-[#133A40]  text-4xl font-bold '>+</h1>

                                </div>
                            </div>
                        </button>

                    </div>)
                    : (
                        <div className="w-full items-center bg-[#103035] rounded-2xl border-2 border-[#2C474B] mt-5  p-4">
                            <CarteReduction fermer={fermer} />
                        </div>
                    )
                }
            </div>


        </>
    );
}