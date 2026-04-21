import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "../components/Header.tsx";
import ModeDePaiementCard from "../components/paiement/ModeDePaiementCard.tsx";
import CheckMarkSVG from "../../../../assets/CheckMark.svg";
import useIsMobile from "../../../../components/layouts/UseIsMobile.tsx";
import type { PanierItem } from "../../../panier/types.ts";
import { useOutletContext } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_BASE = import.meta.env.VITE_API_URL || "";

type CartPaymentState = {
    items: PanierItem[];
    subtotal: number;
    discount: number;
    total: number;
    promo: { code: string; type: "%" | "€" | null; value: number } | null;
};

type CurrentUser = {
    email?: string;
    name?: string;
    firstname?: string;
    lastname?: string;
} | null;

export default function CartPaymentPage() {
    const { state } = useLocation();
    if (!state || !(state as CartPaymentState).items?.length) {
        return <Navigate to="/panier" replace />;
    }
    return <CartPaymentInner state={state as CartPaymentState} />;
}

function CartPaymentInner({ state }: { state: CartPaymentState }) {
    const { items, subtotal, discount, total, promo } = state;
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { setPanierItems } = useOutletContext<{
        setPanierItems: React.Dispatch<React.SetStateAction<PanierItem[]>>;
    }>();

    const [clientSecret, setClientSecret] = useState("");
    const [loadingStripe, setLoadingStripe] = useState(true);
    const [validatePayment, setValidatePayment] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [triggerPayment, setTriggerPayment] = useState<(() => void) | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/me`, { credentials: "include" })
            .then((res) => (res.status === 401 ? null : res.json()))
            .then((data) => setCurrentUser(data?.user ?? data ?? null))
            .catch(() => setCurrentUser(null));
    }, []);

    useEffect(() => {
        if (total <= 0) {
            setLoadingStripe(false);
            return;
        }
        fetch(`${API_BASE}/api/payments/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Math.round(total * 100), currency: "eur" }),
        })
            .then((r) => r.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
                setLoadingStripe(false);
            })
            .catch((err) => {
                console.error("Erreur payment intent:", err);
                setLoadingStripe(false);
            });
    }, [total]);

    useEffect(() => {
        document.body.style.overflow = validatePayment ? "hidden" : "auto";
    }, [validatePayment]);

    const confirmationBody = useMemo(() => {
        const customerName =
            currentUser?.name ??
            `${currentUser?.firstname ?? ""} ${currentUser?.lastname ?? ""}`.trim() ??
            "Client Horizons+";

        return {
            email: currentUser?.email ?? "",
            customerName,
            totalPrice: total,
            promo: promo ?? null,
            items: items.map((it) => ({
                journey: `${it.departLieu} → ${it.arriveeLieu}`,
                date: new Date(it.dateVoyage).toISOString().split("T")[0],
                time: `${it.departHeure} - ${it.arriveeHeure}`,
                price: Number(it.prix) || 0,
                passengers: 1,
                class: it.classe,
                transportType: it.typeTransport,
            })),
        };
    }, [currentUser, items, total, promo]);

    const handleSuccess = async () => {
        try {
            await fetch(`${API_BASE}/api/panier/clear`, {
                method: "POST",
                credentials: "include",
            });
            setPanierItems([]);
        } catch (err) {
            console.error("Erreur clear panier:", err);
        }
        setValidatePayment(true);
    };

    return (
        <div className={`relative w-full ${isMobile ? "px-4" : "py-10"}`}>
            <Header Titre="Paiement du panier" />

            <div className={`${isMobile ? "" : "m-20"} bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8`}>
                <p className="font-bold mb-4">Récapitulatif de votre panier</p>

                <ul className="space-y-3 text-[15px]">
                    {items.map((it) => (
                        <li key={it.id} className="flex justify-between items-center border-b border-[#2C474B] pb-2">
                            <div>
                                <p className="font-semibold">{it.departLieu} → {it.arriveeLieu}</p>
                                <p className="text-xs opacity-80">
                                    {new Date(it.dateVoyage).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                    {" • "}{it.departHeure} - {it.arriveeHeure}
                                    {" • "}{it.classe}
                                </p>
                            </div>
                            <span className="font-bold">{Number(it.prix).toFixed(2)} €</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-5 space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="opacity-80">Sous-total</span>
                        <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-primary">
                            <span>Réduction{promo ? ` (${promo.code})` : ""}</span>
                            <span>– {discount.toFixed(2)} €</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#2C474B] mt-2">
                        <span>Total</span>
                        <span>{total.toFixed(2)} €</span>
                    </div>
                </div>
            </div>

            <div className="z-2">
                {!loadingStripe && clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
                        <ModeDePaiementCard
                            clientSecret={clientSecret}
                            setValidatePaymentOverlay={handleSuccess}
                            setTriggerPayment={setTriggerPayment}
                            passagersData={[{ email: currentUser?.email, firstname: currentUser?.firstname, lastname: currentUser?.lastname }]}
                            journey={{ departureName: "", arrivalName: "", departureTime: "", arrivalTime: "", price: total }}
                            formattedDepartureDate=""
                            setIsPaying={setIsPaying}
                            confirmationBody={confirmationBody}
                        />
                    </Elements>
                )}
            </div>

            <div className="flex justify-center">
                <button
                    className="w-[280px] h-[55px] bg-[#98EAF3] rounded-xl mt-6 mb-10 cursor-pointer flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    disabled={isPaying || !triggerPayment || !currentUser?.email}
                    onClick={() => triggerPayment && triggerPayment()}
                >
                    {isPaying && (
                        <svg className="animate-spin h-6 w-6 text-[#115E66]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    )}
                    <span className="text-[#115E66] font-bold text-xl">
                        {isPaying ? "Paiement..." : `Payer ${total.toFixed(2)} €`}
                    </span>
                </button>
            </div>

            {!currentUser?.email && (
                <p className="text-center text-sm text-red-300 mb-8">
                    Vous devez être connecté pour finaliser le paiement.
                </p>
            )}

            {validatePayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#103035]/50"
                    onClick={() => { setValidatePayment(false); navigate("/reservations"); }}
                >
                    <div
                        className={`bg-[#2C474B] p-6 mx-5 rounded-2xl ${isMobile ? "w-80" : "w-[28rem]"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid gap-5">
                            <div className="flex justify-center">
                                <img src={CheckMarkSVG} alt="" />
                            </div>
                            <p className={`text-center font-semibold ${isMobile ? "text-sm" : "text-xl"}`}>
                                Votre commande est validée. Un e-mail de confirmation vous sera envoyé avec tous vos billets.
                            </p>
                            <button
                                className="w-full h-12 bg-[#98EAF3] rounded-xl cursor-pointer"
                                onClick={() => navigate("/reservations")}
                            >
                                <span className="text-[#115E66] font-bold">Voir mes réservations</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
