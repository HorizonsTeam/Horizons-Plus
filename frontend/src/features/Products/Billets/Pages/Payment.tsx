import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReturnBtn from '../../../../assets/ReturnBtn.svg';
import ModeDePaiementCard from '../components/paiement/ModeDePaiementCard.tsx';
import assurance_Ico from '../../../../assets/assurance.svg';
import useIsMobile from '../../../../components/layouts/UseIsMobile.tsx';
import { useEffect } from 'react';
import CheckMarkSVG from '../../../../assets/CheckMark.svg';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
import type { LocationState } from '../types.ts';



export default function PaymentPage() {
    const { state } = useLocation();
    const { journey, selectedClass, passagersCount, formattedDepartureDate, passagersData } = (state || {}) as LocationState & { passagersData: number[] };

    const [IsSelected, setIsSelected] = useState(false);
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [clientSecret, setClientSecret] = useState("");
    const [loadingStripe, setLoadingStripe] = useState(true);
    const [ValidatePayment, setValidatePaymentOverlay] = useState(false);

    const [triggerPayment, setTriggerPayment] = useState<(() => void) | null>(null);
    const [assurance, setAssurance] = useState<boolean>(false);

    // Affichage dès le payement validé    
    useEffect(() => {
        if (ValidatePayment) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
    }, [ValidatePayment]);

    const onClick = () => setIsSelected(!IsSelected);
    const handleRetour = () => navigate(-1);

    useEffect(() => {
        console.log("FRONT → URL utilisée :", `${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`);
        const API_BASE = import.meta.env.VITE_API_URL || "";
        fetch(`${API_BASE}/api/payments/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: 5900,
                currency: "eur"
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("FRONT → data reçue :", data);
                setClientSecret(data.clientSecret);
                setLoadingStripe(false);
            })
            .catch((err) => console.error("Erreur :", err));
    }, []);

    // const options = { clientSecret };
    return (
        <>
            <div className={`relative w-full ${isMobile ? "px-4" : " py-10"}`}>

                {/* HEADER */}
                <div className="m-2 p-6 mb-10 -mt-3 ">
                    <div className="relative mt-4 flex justify-center items-center">
                        <button onClick={handleRetour}>
                            <img
                                src={ReturnBtn}
                                alt="Return Button"
                                className="absolute left-0 -translate-x-1/2 transform"
                            />
                        </button>
                        <h1 className="text-3xl text-[#98EAF3] font-medium text-center">
                            Paiement 
                        </h1>
                    </div>
                </div>

                {/* A recupérer les infos - A FAIRE BACKEND */}
                {/* RÉCAP */}
                <div className={` ${isMobile ? '' : 'm-20'} bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8 `}>
                    <p className="font-bold mb-4">Récapitulatif de votre réservation</p>

                    <ul className="space-y-4 text-[15px] display-center items-center">
                        <li><p>Trajet : <span className="font-semibold">{journey.departureName} → {journey.arrivalName}</span></p></li>
                        <li><p>Date : <span className="font-semibold">{formattedDepartureDate} • {journey.departureTime} - {journey.arrivalTime}</span></p></li>
                        <li><p>Classe : <span className="font-semibold">{selectedClass}</span></p></li>
                        <li><p>Passager : <span className="font-semibold">{passagersCount} passager{(passagersCount ?? 1) > 1 ? "s" : ""}</span></p></li>
                        <li><p>Prix Total : <span className="font-bold text-xl">{journey.price * (passagersCount ?? 1) + (assurance == true ? 3.50 : 0)} €</span></p></li>
                    </ul>
                </div>

                {/* Intégration de Stripe elements */}
                {/* MODE DE PAIEMENT */}

                {!loadingStripe && clientSecret && (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: { theme: "night" }
                        }}
                    >
                        <ModeDePaiementCard
                            clientSecret={clientSecret}
                            setValidatePaymentOverlay={setValidatePaymentOverlay}
                            setTriggerPayment={setTriggerPayment}
                            passagersData={passagersData}
                            journey={journey}
                            formattedDepartureDate={formattedDepartureDate}
                        />
                    </Elements>
                )}



                {/* OPTIONS SUPPLÉMENTAIRES */}
                <div className={` ${isMobile ? '' : 'm-20'} bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8 `}>
                    <p className="font-bold mb-4">Options supplémentaires</p>

                    {/* Assurance */}
                    <button
                        onClick={onClick}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition cursor-pointer
                        ${IsSelected ? "border-[#98EAF3] text-[#98EAF3]" : "border-[#2C474B] text-white"}`}
                    >
                        <img src={assurance_Ico} className="h-6 w-6"/>
                        <p className="font-semibold text-sm flex-1 ml-4" onClick={() => setAssurance(!assurance)}>Assurance annulation (+3,50 €)</p>
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
                        <p className="text-2xl font-bold">{journey.price * (passagersCount ?? 1) + (assurance == true ? 3.50 : 0)} €</p>
                    </div>
                </div>

                {/* BOUTON PAYER */}
                <div className="flex justify-center">
                    <button className="w-[250px] h-[55px] bg-[#98EAF3] rounded-xl mt-6 mb-10" type='button' onClick={() => triggerPayment && triggerPayment()}>
                        <span className="text-[#115E66] font-bold text-2xl" >Payer</span>
                    </button>
                </div>

                {ValidatePayment && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#103035]/50"
                        onClick={() => setValidatePaymentOverlay(false)}
                    >
                        <div
                            className={`bg-[#2C474B] p-6 mx-5 rounded-2xl ${isMobile ? 'w-80' : 'w-[28rem]'
                                }`}
                            onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique dans la carte
                        >
                            <div className={`grid ${isMobile ? 'gap-10' : 'gap-10'}`}>

                                <div className='grid grid-cols gap-5 '>

                                    <div className="flex justify-center">
                                        <img src={CheckMarkSVG} alt="" />
                                    </div>

                                    <p
                                        className={`text-center font-semibold ${isMobile ? 'text-sm' : 'text-xl'
                                            }`}
                                    >
                                        Votre commande est validée. Un e-mail de confirmation vous sera envoyé.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div >
        </>
    );
}
