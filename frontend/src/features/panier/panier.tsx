import ReturnBtn from '../../assets/ReturnBtn.svg';
import Traincard from './ProductCards/Train';
import type { PanierItem, BackendPanierItem, BackendPanierResponse } from './types.ts';
import { useEffect, useState } from 'react';

const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

export default function Panier () {
    const [panierItems, setPanierItems] = useState<PanierItem[]>([]);
    
    const handleItemDeleted = (id: number) => {
        setPanierItems(prev => prev.filter(item => item.id !== id));
    }

    useEffect(() => {
        async function loadPanier() {
            try {
                const res = await fetch(`${base}/api/panier/`, {
                    method: "GET",
                    credentials: "include",
                });

                const data: BackendPanierResponse = await res.json();
                console.log("Panier data:", data);

                const items: PanierItem[] = data.items.map((item: BackendPanierItem) => ({
                    id: item.panier_item_id,
                    panierId: item.panier_id,
                    passagerId: item.passager_id,
                    departHeure: item.depart_heure.slice(0, 5),
                    departLieu: item.depart_lieu,
                    arriveeHeure: item.arrivee_heure.slice(0, 5),
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
            catch (error) {
                console.error("Erreur lors de la récupération du panier :", error);
            }
        }

        loadPanier();
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
                    onDeleted={handleItemDeleted}
                />
            ))}
        </>
    )
}   



