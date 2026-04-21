import ReturnBtn from "../../assets/ReturnBtn.svg";
import Traincard from "./ProductCards/Train";
import type { PanierItem, BackendPanierItem, BackendPanierResponse } from "./types.ts";
import { useEffect, useMemo, useState } from "react";
import Error from "../../components/AdditionalsComponents/Error.tsx";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import Popup from "../../components/AdditionalsComponents/PopUp.tsx";
import { useOutletContext } from "react-router-dom";


const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

type PromoState = {
    code: string;
    type: "%" | "€" | null;
    value: number;
    applied: boolean;
};

export default function Panier() {
    const navigate = useNavigate();
    const { panierItems, setPanierItems } = useOutletContext<{
        panierItems: PanierItem[];
        setPanierItems: React.Dispatch<React.SetStateAction<PanierItem[]>>;
    }>();

    const handleItemDeleted = (id: number) => {
        setDeleteItemDownload(true);
        setPanierItems((prev) => prev.filter((item) => item.id !== id));
        setDeleteItemDownload(false);
    };
    const [DeleteItemDownload, setDeleteItemDownload] = useState<boolean>(false);


    useEffect(() => {
        async function loadPanier() {
            try {
                const res = await fetch(`${base}/api/panier/`, {
                    method: "GET",
                    credentials: "include",
                });

                const data: BackendPanierResponse = await res.json();

                const items: PanierItem[] = data.items.map((item: BackendPanierItem) => {
                    const jd = item.journey_data;

                    return {
                        id: item.panier_item_id,
                        panierId: item.panier_id,
                        passagerId: item.passager_id,

                        classe: jd.classe,
                        siegeRestant: jd.siegeRestant,
                        prix: parseFloat(jd.journey.price),

                        dateVoyage: new Date(jd.dateVoyage),
                        typeTransport: jd.transportType,

                        departHeure: jd.journey.departureTime,
                        arriveeHeure: jd.journey.arrivalTime,
                        departLieu: jd.journey.departureName,
                        arriveeLieu: jd.journey.arrivalName,

                        ajouteLe: new Date(item.ajoute_le),

                        journey: {
                            ...jd.journey, 
                            price: parseFloat(jd.journey.price)
                        },
                    };
                });

                setPanierItems(items);
            } catch (error) {
                console.error("Erreur lors de la récupération du panier :", error);
            }
        }

        loadPanier();
    }, []);

    const [displayError, setDisplayError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayError(panierItems.length === 0);
        }, 2000); 

        return () => clearTimeout(timer);
    }, [panierItems.length]);
    const [isItemDeleted, setIsItemDeleted] = useState(false);
    const Popup_btn =
    (
        <button
            type="button"
            className="px-4 py-2 bg-[#98EAF3] text-[#0C2529] font-semibold rounded-full"
            onClick={() => setIsItemDeleted(false)}
        >
            Fermer
        </button>
    )

    const subtotal = useMemo(
        () => panierItems.reduce((sum, it) => sum + (Number(it.prix) || 0), 0),
        [panierItems]
    );

    const [promo, setPromo] = useState<PromoState>({ code: "", type: null, value: 0, applied: false });
    const [promoError, setPromoError] = useState<string | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);

    const discount = useMemo(() => {
        if (!promo.applied) return 0;
        if (promo.type === "%") return (subtotal * promo.value) / 100;
        if (promo.type === "€") return Math.min(promo.value, subtotal);
        return 0;
    }, [promo, subtotal]);

    const total = Math.max(0, subtotal - discount);

    async function handleApplyPromo() {
        if (!promo.code.trim() || promo.applied || promoLoading) return;
        setPromoError(null);
        setPromoLoading(true);
        try {
            const first = panierItems[0];
            const res = await fetch(`${base}/api/promo/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: promo.code.trim(),
                    transport: first?.typeTransport === "AVION" ? "avion" : "train",
                    price: subtotal,
                    class: first?.classe,
                }),
            });
            const data = await res.json();
            if (!data.valid) {
                setPromoError(data.message || "Code invalide.");
                return;
            }
            setPromo((p) => ({ ...p, type: data.type, value: Number(data.value), applied: true }));
        } catch {
            setPromoError("Erreur serveur, réessayez.");
        } finally {
            setPromoLoading(false);
        }
    }

    function handleRemovePromo() {
        setPromo({ code: "", type: null, value: 0, applied: false });
        setPromoError(null);
    }

    function handlePay() {
        if (panierItems.length === 0) return;
        navigate("/CartPayment", {
            state: {
                items: panierItems,
                subtotal,
                discount,
                total,
                promo: promo.applied ? { code: promo.code, type: promo.type, value: promo.value } : null,
            },
        });
    }

    return (
        <div className="min-h-screen bg-[#133A40]">
            <div className="relative pt-6 pb-4">
                <button onClick={() => navigate(-1)} className="absolute left-4 top-6 cursor-pointer">
                    <img src={ReturnBtn} alt="Return Button" className="h-8 w-8" />
                </button>
                <h1 className="text-3xl text-[#98EAF3] font-bold text-center">Panier</h1>
            </div>

            <div className="px-4 pb-10 space-y-5 ">
                {panierItems.map((item) => (
                        <Traincard key={item.id} item={item} onDeleted={handleItemDeleted} />
                    ))
                }

                { displayError && (
                    <div className="max-w-2xl mx-auto">
                        <Error errorMessage="Votre panier est vide." />
                    </div>
                )}
                {
                    !displayError && panierItems.length === 0 &&
                    <Loader size={60} className="mx-auto" />
                }
                {
                    DeleteItemDownload &&
                    <Loader size={80}></Loader>
                }
                {isItemDeleted &&
                    <Popup message="L'élément a été supprimé avec succès." Btn={Popup_btn}  isLoading={DeleteItemDownload}/>
                }

                {panierItems.length > 0 && (
                    <div className="max-w-2xl mx-auto bg-[#0C2529] border-2 border-[#2C474B] rounded-2xl p-5 mt-6">
                        <p className="font-bold mb-4 text-lg">Récapitulatif</p>

                        <div className="flex justify-between text-sm mb-2">
                            <span className="opacity-80">Sous-total ({panierItems.length} billet{panierItems.length > 1 ? "s" : ""})</span>
                            <span className="font-semibold">{subtotal.toFixed(2)} €</span>
                        </div>

                        {promo.applied && (
                            <div className="flex justify-between text-sm mb-2 text-primary">
                                <span>
                                    Code <strong>{promo.code}</strong>
                                    {promo.type === "%" && ` (-${promo.value}%)`}
                                </span>
                                <span>– {discount.toFixed(2)} €</span>
                            </div>
                        )}

                        <div className="border-t border-[#2C474B] my-3" />

                        <div className="flex justify-between items-center mb-5">
                            <span className="font-bold text-xl">Total</span>
                            <span className="font-extrabold text-2xl">{total.toFixed(2)} €</span>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm opacity-80 mb-2">Code promo</label>
                            {promo.applied ? (
                                <div className="flex items-center justify-between bg-[#133A40] rounded-xl px-4 py-3">
                                    <span className="font-semibold text-primary">{promo.code} appliqué</span>
                                    <button
                                        type="button"
                                        onClick={handleRemovePromo}
                                        className="text-sm text-red-300 cursor-pointer hover:underline"
                                    >
                                        Retirer
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={promo.code}
                                            onChange={(e) => setPromo((p) => ({ ...p, code: e.target.value }))}
                                            placeholder="EX: NOEL10"
                                            className="flex-1 bg-[#133A40] h-[45px] rounded-l-xl px-3 outline-none focus:ring-2 focus:ring-[#98EAF3] font-semibold"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyPromo}
                                            disabled={promoLoading || !promo.code.trim()}
                                            className="bg-[#98EAF3] text-[#103035] font-bold px-5 h-[45px] rounded-r-xl hover:bg-[#7cdbe6] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {promoLoading ? "..." : "Valider"}
                                        </button>
                                    </div>
                                    {promoError && <p className="text-sm text-red-300 mt-2">{promoError}</p>}
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handlePay}
                            className="w-full h-14 bg-[#98EAF3] rounded-xl cursor-pointer hover:bg-[#7cdbe6] transition-colors"
                        >
                            <span className="text-[#115E66] font-bold text-xl">
                                Payer {total.toFixed(2)} €
                            </span>
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
}
