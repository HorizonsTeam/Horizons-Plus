import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PanierBtn from '../AdditionalsComponents/PanierBtn.tsx';
import type { PanierItem, BackendPanierResponse } from "../../features/panier/types.ts";
import { useState, useEffect } from 'react';
import useIsMobile from './UseIsMobile.tsx';
import PopUp from '../AdditionalsComponents/PopUp.tsx';
const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

export default function MainLayout() {
  const [panierItems, setPanierItems] = useState<PanierItem[]>([]);
  const [displayBtnPanier, setDisplayBtnPanier] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const PopUpBtn = (
    <div className="w-full flex justify-between gap-4  text-xs">
      <button
        className="flex-1 bg-primary text-[#0C2529] font-bold py-2 px-4 rounded-2xl shadow-md hover:brightness-110 transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFB856]/50"
        onClick={() => { navigate('/login')}}
      >
        Se connecter
      </button>
      <button
        className="flex-1 bg-[#133A40] text-white  font-bold py-2 px-4 rounded-2xl border border-[#2C474B]  transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFB856]/50 cursor::pointer"
        onClick={()=>{setShowPopup(false)}}
      >
        Continuer sans connexion
      </button>
    </div>
  );



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
          departHeure: item.depart_heure.slice(0, 5),
          departLieu: item.depart_lieu,
          arriveeHeure: item.arrivee_heure.slice(0, 5),
          arriveeLieu: item.arrivee_lieu,
          classe: item.classe,
          siegeRestant: item.siege_restant,
          prix: parseFloat(item.prix),
          ajouteLe: new Date(item.ajoute_le),
          dateVoyage: new Date(item.date_voyage),
          typeTransport: item.transport_type,
        }));

        setPanierItems(items);
      } catch (error) {
        setShowPopup(true);
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

      {showPopup && 
        <PopUp message="Avez-vous un compte ?" Btn={PopUpBtn} setPopupIsDisplayed={setShowPopup} mode='question'/>
      
      }

      <Footer />
    </>
  );
}
