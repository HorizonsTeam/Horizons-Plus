import ReturnBtn from '../../assets/ReturnBtn.svg';
import Traincard from './ProductCards/Train';
import type { PanierItem, BackendPanierItem, BackendPanierResponse } from './types.ts';
import { useEffect, useState } from 'react';

const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

export default function Panier () {
    const [panierItems, setPanierItems] = useState<PanierItem[]>([]);

    useEffect(() => {
        async function fetchPanier() {
            const userId = "acD52dnU3Vq9HmVapfiUJt7X2X7r1fP7";

            const res = await fetch(`${base}/api/panier/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data: BackendPanierResponse = await res.json();
            console.log("Panier data:", data);

            const items: PanierItem[] = data.items.map((item: BackendPanierItem) => ({
                id: item.panier_item_id,
                panierId: item.panier_id,
                passagerId: item.passager_id,
                departHeure: new Date(item.depart_heure),
                departLieu: item.depart_lieu,
                arriveeHeure: new Date(item.arrivee_heure),
                arriveeLieu: item.arrivee_lieu,
                classe: item.classe,
                siegeLabel: item.siege_label,
                prix: parseFloat(item.prix),
                ajouteLe: new Date(item.ajoute_le),
                dateVoyage: new Date(item.date_voyage),
                typeTransport: item.transport_type,
            }))

            setPanierItems(items);
        }

        fetchPanier();
    }, []);

    return (
        <>
            <div className='relative mt-4'>
                <img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' />
                <h1 className='text-3xl text-[#98EAF3] font-bold text-center'>Panier</h1>
            </div>
            
            {panierItems.map((item) => (
                <Traincard 
                    key={item.id} 
                    item={item} 
                />
            ))}
        </>
    )
}   



