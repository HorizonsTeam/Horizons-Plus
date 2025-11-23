import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReturnBtn from '../../../assets/ReturnBtn.svg';
import ModeDePaiementCard from './components/paiement/ModeDePaiementCard';
import assurance_Ico from '../../../assets/assurance.svg';
import useIsMobile from '../../../components/layouts/UseIsMobile';

export default function PaymentPage() {

    const [IsSelected, setIsSelected] = useState(false);
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const onClick = () => setIsSelected(!IsSelected);
    const handleretour = () => navigate(-1);

    return (
        <div className={`w-full ${isMobile ? "px-4" : " py-10"}`}>

            {/* HEADER */}
            <div className="relative flex items-center justify-center mb-10">
                <button onClick={handleretour} className="absolute left-2 top-1/2 -translate-y-1/2">
                    <img src={ReturnBtn} alt="Retour" className="h-6 w-6" />
                </button>
                <h1 className="text-3xl text-[#98EAF3] font-semibold">Paiement</h1>
            </div>

            {/* RÉCAP */}
            <div className={` ${isMobile ? '' : 'm-20' } bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8 `}>
                <p className="font-bold mb-4">Récapitulatif de votre réservation</p>

                <ul className="space-y-4 text-[15px] display-center items-center">
                    <li><p>Trajet : <span className="font-semibold">Moulins-sur-Allier → Nevers</span></p></li>
                    <li><p>Date : <span className="font-semibold">Jeudi 18 septembre 2025 • 6h50 - 7h37</span></p></li>
                    <li><p>Classe : <span className="font-semibold">Économie</span></p></li>
                    <li><p>Passager : <span className="font-semibold">Pierre Dupont</span></p></li>
                    <li><p>Prix Total : <span className="font-bold text-xl">59,00 €</span></p></li>
                </ul>
            </div>

            {/* MODE DE PAIEMENT */}
            <ModeDePaiementCard />

            {/* OPTIONS SUPPLÉMENTAIRES */}
            <div className={` ${isMobile ? '' : 'm-20'} bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8 `}>
                <p className="font-bold mb-4">Options supplémentaires</p>

                {/* Assurance */}
                <button
                    onClick={onClick}
                    className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition 
          ${IsSelected ? "border-[#98EAF3] text-[#98EAF3]" : "border-[#2C474B] text-white"}`}
                >
                    <img src={assurance_Ico} className="h-6 w-6" />
                    <p className="font-semibold text-sm flex-1 ml-4">Assurance annulation (+3,50 €)</p>
                    <div className={`h-6 w-6 rounded-full border-2 border-[#2C474B] ${IsSelected ? 'bg-[#98EAF3]' : ''}`} />
                </button>

                {/* CODE PROMO */}
                <div className="flex items-center gap-4 mt-6">
                    <p className="font-bold w-32">Code promo</p>
                    <input
                        type="text"
                        className="flex-1 bg-[#103035] h-[45px] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] font-semibold"
                    />
                </div>
            </div>

            {/* TOTAL */}
            <div className={` ${isMobile ? '' : 'm-20'}  p-5 mb-8 `}>

            <div className="flex justify-between items-center mt-10">
                <p className="text-2xl font-bold">Total :</p>
                <p className="text-2xl font-bold">59,00 €</p>
            </div>
            </div>

            {/* BOUTON PAYER */}
            <div className="flex justify-center">
                <button className="w-[250px] h-[55px] bg-[#98EAF3] rounded-xl mt-6 mb-10">
                    <span className="text-[#115E66] font-bold text-2xl">Payer</span>
                </button>
            </div>

        </div>
    );
}
