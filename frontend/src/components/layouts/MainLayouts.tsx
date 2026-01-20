import { Outlet} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PanierBtn from '../AdditionalsComponents/PanierBtn.tsx';
import type { PanierItem, BackendPanierResponse } from "../../features/panier/types.ts";
import { useState, useEffect } from 'react';
import useIsMobile from './UseIsMobile.tsx';
const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

export default function MainLayout() {
  const [panierItems, setPanierItems] = useState<PanierItem[]>([]);
  const [displayBtnPanier, setDisplayBtnPanier] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    async function loadPanier() {
      try {
        const res = await fetch(`${base}/api/panier/`, {
          method: "GET",
          credentials: "include",
        });
        const data: BackendPanierResponse = await res.json();

        const items: PanierItem[] = data.items.map(item => ({
          id: item.panier_item_id,
          panierId: item.panier_id,
          passagerId: item.passager_id,
          departHeure: item.journey_data.journey.departureTime,
          departLieu: item.journey_data.journey.departureName,
          arriveeHeure: item.journey_data.journey.arrivalTime,
          arriveeLieu: item.journey_data.journey.arrivalName,
          classe: item.journey_data.classe,
          siegeRestant: item.journey_data.siegeRestant,
          prix: parseFloat(item.journey_data.journey.price),
          ajouteLe: new Date(item.ajoute_le),
          dateVoyage: new Date(item.journey_data.dateVoyage),
          typeTransport: item.journey_data.transportType,
          journey: { 
            ...item.journey_data.journey, 
            price: parseFloat(item.journey_data.journey.price),
          },
        }));

        setPanierItems(items);
      } catch (error) {
        console.error(error);
      }
    }

    loadPanier();
  }, []);

  useEffect(() => {
    if (panierItems.length > 0 && isMobile) {
      setDisplayBtnPanier(true);
    } else {
      setDisplayBtnPanier(false);
    }
  }, [panierItems, isMobile]);

  return (
    <>
      <Header />
      <main>
        <Outlet context={{ panierItems, setPanierItems }} />
      </main>

      {
        displayBtnPanier &&
        <PanierBtn nombresArticles={panierItems.length} />
      }
      <Footer />
    </>
  );
}
