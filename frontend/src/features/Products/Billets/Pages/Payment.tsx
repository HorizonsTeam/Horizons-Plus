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

const API_BASE = import.meta.env.VITE_API_URL || "";

function getBaseInsurancePrice(ticketClass: string) {
    switch (ticketClass) {
        case "Économie":
            return 3.50;
        case "Confort":
            return 5.00;
        case "Business":
            return 7.50;
        case "Première":
            return 10.00;
        default:
            return 3.50;
    }
}

function getInsuranceTotal(ticketClass: string, passengersCount: number) {
    return getBaseInsurancePrice(ticketClass) * passengersCount;
}

export default function PaymentPage() {
    const { state } = useLocation();
    const { journey, selectedClass, passagersCount, formattedDepartureDate, passagersData } = (state || {}) as LocationState & { passagersData: number[] };

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [clientSecret, setClientSecret] = useState("");
    const [loadingStripe, setLoadingStripe] = useState(true);
    const [ValidatePayment, setValidatePaymentOverlay] = useState(false);

    const [triggerPayment, setTriggerPayment] = useState<(() => void) | null>(null);

    const [code, setCode] = useState("");
    const basePrice = journey.price * passagersCount;
    const [priceTotal, setPriceTotal] = useState<number>(basePrice);
    const [promoValue, setPromoValue] = useState(0);
    const [promoType, setPromoType] = useState(null);
    const [promoApplied, setPromoApplied] = useState<boolean>(false);

    const insuranceUnitPrice = getBaseInsurancePrice(selectedClass); // Prix unitaire de l'assurance selon la classe
    const [insurance, setInsurance] = useState<boolean>(false);

    // Affichage dès le payement validé    
    useEffect(() => {
        if (ValidatePayment) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
    }, [ValidatePayment]);

    const handleRetour = () => {
        navigate(-1); 
        
    };

    useEffect(() => {
        fetch(`${API_BASE}/api/payments/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Math.round(priceTotal * 100),
                currency: "eur"
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
                setLoadingStripe(false);
            })
            .catch((err) => console.error("Erreur :", err));
    }, []);

    async function handleValidatePromo() {
        if (promoApplied || !code.trim()) return;

        try {
            const res = await fetch(`${API_BASE}/api/promo/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    code,
                    transport: "avion",
                    price: priceTotal,
                    class: selectedClass,
                }),
            });

            const data = await res.json();
            console.log("Promo data reçue :", data);

            if (!data.valid) {
                console.error(data.message);
                return;
            }

            setPromoValue(data.value);
            setPromoType(data.type);
            setPromoApplied(true);
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    }

    useEffect(() => {
        let price = basePrice;

        // Promo
        if (promoApplied) {
            if (promoType === "%") {
                price = price * (1 - promoValue / 100);
            } else if (promoType === "€") {
                price -= promoValue;
            }
        }

        // insurance
        const insuranceTotal = insurance
            ? getBaseInsurancePrice(selectedClass) * passagersCount
            : 0;

        price += insuranceTotal;

        setPriceTotal(price);
    }, [basePrice, insurance, promoApplied, promoValue, promoType]);

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
                        <li><p>Passager : <span className="font-semibold">{passagersCount} passager{passagersCount > 1 ? "s" : ""}</span></p></li>
                        <li><p>Prix Total : <span className="font-bold text-xl">{priceTotal.toFixed(2)} €</span></p></li>
                    </ul>
                </div>

                {/* Intégration de Stripe elements */}
                {/* MODE DE PAIEMENT */}
                <div className='z-2'>
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

                </div>

                {/* OPTIONS SUPPLÉMENTAIRES */}
                <div className={` ${isMobile ? '' : 'm-20'} bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8 `}>
                    <p className="font-bold mb-4">Options supplémentaires</p>

                    {/* insurance */}
                    <button
                        onClick={() => setInsurance(prev => !prev)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition cursor-pointer
                        ${insurance ? "border-[#98EAF3] text-[#98EAF3]" : "border-[#2C474B] text-white"}`}
                    >
                        <img src={assurance_Ico} className="h-6 w-6"/>

                        <p className="font-semibold text-sm flex-1 ml-4">
                            Assurance annulation (+{insuranceUnitPrice.toFixed(2)} € / passager)
                        </p>

                        <div 
                            className={`h-6 w-6 rounded-full border-2 border-[#2C474B] ${
                                insurance ? 'bg-[#98EAF3]' : ''
                            }`} 
                        />
                    </button>

                    {/* CODE PROMO */}
                    <div className="flex items-center gap-4 mt-6">
                        <p className="font-bold w-32">Code promo</p>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder='EX: NOEL10'
                            className="flex-1 bg-[#103035] h-[45px] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] font-semibold"
                        />
                        <button
                            onClick={handleValidatePromo}
                            className="bg-[#98EAF3] text-[#103035] font-bold px-5 h-[45px] rounded-xl hover:bg-[#7cdbe6] transition-colors cursor-pointer"
                        >
                            Valider
                        </button>
                    </div>
                </div>

                {/* TOTAL */}
                <div className={` ${isMobile ? '' : 'm-20'}  p-5 mb-8 `}>

                    <div className="flex flex-col items-end mt-10">
                        <p className="text-2xl font-bold">Total :</p>

                        <div className="text-right">

                            {/* Prix avant promo */}
                            {promoApplied && (
                                <p className="text-gray-400 text-sm line-through">
                                    {basePrice} €
                                </p>
                            )}

                            {/* insurance */}
                            {insurance && (
                                <p className="text-[#FFB856] font-semibold text-sm mt-1">
                                    + {getInsuranceTotal(selectedClass, passagersCount).toFixed(2)} € d’assurance 
                                    ({passagersCount} passager{passagersCount > 1 ? "s" : ""})
                                </p>
                            )}


                            {/* Prix final */}
                            <p className="text-4xl font-extrabold text-white">
                                {priceTotal.toFixed(2)} €
                            </p>

                            {/* Réduction */}
                            {promoApplied && (
                                <>
                                    {/* Montant retiré */}
                                    <p className="text-primary font-semibold text-sm mt-1">
                                    – {promoType === "%" 
                                        ? ((basePrice * promoValue) / 100).toFixed(2)
                                        : promoValue
                                        } €
                                    </p>

                                    {/* Si pourcentage, afficher aussi le % */}
                                    {promoType === "%" && (
                                    <p className="text-primary font-semibold text-xs">
                                        ({promoValue}% appliqués)
                                    </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOUTON PAYER */}
                <div className="flex justify-center">
                    <button className="w-[250px] h-[55px] bg-[#98EAF3] rounded-xl mt-6 mb-10 cursor-pointer" type='button' onClick={() => triggerPayment && triggerPayment()}>
                        <span className="text-[#115E66] font-bold text-2xl">Payer</span>
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
