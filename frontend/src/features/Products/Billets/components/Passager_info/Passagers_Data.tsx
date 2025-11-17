import Gender_Selection from './Gender';
import { useState } from 'react';

type Props = {
    passagerIndex?: number;
    suprimer_Passager?: () => void;
};

export default function Passagers_Data_From({ passagerIndex, suprimer_Passager }: Props)
{      
    const titre = passagerIndex === 1
        ? "Vos informations"
        : `Informations du passager ${passagerIndex}`;

        const [selectedGender, setSelectedGender] = useState("Homme");
        
    return (

        <>
            <div className="w-full items-center bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 p-4">
                <div className='w-full flex justify-between'>
                    <p className="font-bold mt-4 ">{titre}</p>
                    {passagerIndex !== 1 && (
                        <button className="font-bold text-xl " onClick={suprimer_Passager}>
                            X
                        </button>
                    )}
                </div>
            <div className="w-full mt-2 border-t-2 border-[#2C474B] ">
                <div className="flex  mt-4 mb-4">
                    <Gender_Selection
                        value="Homme"
                        IsSelected={selectedGender === "Homme"}
                        onClick={() => setSelectedGender("Homme")}
                    />

                    <Gender_Selection
                        value="Femme"
                        IsSelected={selectedGender === "Femme"}
                        onClick={() => setSelectedGender("Femme")}
                    />

                    <Gender_Selection
                        value="Autre"
                        IsSelected={selectedGender === "Autre"}
                        onClick={() => setSelectedGender("Autre")}
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
                    <input type="text" className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />
                    <input type="text" className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />
                    <input type="date" className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />
                    <input type="email" className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />
                    <input type="tel" className="h-13  rounded-md px-3 border-3 border-[#2C474B] bg-[#103035] focus:border-[#98EAF3] focus:outline-none w-full" />

                </div>
                </div>

            </div>
            </div>


        </>
    );
}