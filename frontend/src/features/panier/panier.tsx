import ReturnBtn from "../../assets/ReturnBtn.svg";
import Traincard from "./ProductCards/Train";
import type { PanierItem, BackendPanierItem, BackendPanierResponse } from "./types.ts";
import { useEffect, useState } from "react";
import Error from "../../components/AdditionalsComponents/Error.tsx";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import Popup from "../../components/AdditionalsComponents/PopUp.tsx";
import { useOutletContext } from "react-router-dom";


const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

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

            </div>

        </div>
    );
}
