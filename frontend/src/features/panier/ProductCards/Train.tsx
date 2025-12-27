import TrainIco from '../../../assets/train_icon.svg';
import mobigoIco from '../../../assets/mobigo_ico.svg';
import terIco from '../../../assets/ter_ico.svg';
import SiègeIco from '../../../assets/siege_ico.svg';
import trashcan from '../../../assets/trashcan.svg';
import type { TrainCardProps } from '../types.ts';

const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

export default function TrainCard({ item, onDeleted }: TrainCardProps) {
  const handleDeletePanierItem = async () => {
    try {
      const res = await fetch(`${base}/api/panier/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId: item.id }),
      });

      if (!res.ok) throw new Error("Erreur lors de la suppresion");

      onDeleted(item.id);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
      alert("Impossible de supprimer l'item.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#133A40] rounded-lg shadow-md p-4 text-sm text-white font-sans  m-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src={TrainIco} alt="Train icon" className="h-7 w-7" />
          <img src={mobigoIco} alt="Mobigo logo" className="h-10 w-20 ml-3" />
        </div>
        <span className="text-Bold text-xl text-white">{item.dateVoyage.toLocaleDateString()}</span>
      </div>

      
    <div className='flex items-center justify-between w-84'>
        {/* Trajet */}
        <div className="mb-4 w-50">
            <p className="text-xl mb-5 -ml-30">n°{item.id}</p>
            <h2 className="text-xl font-semibold mb-1 text-left">{item.departLieu} → {item.arriveeLieu}</h2>
        </div>
        {/* Horaires sous la date */}
        <div className="grid grid-cols gap-0 w-22 ml-10 -mt-7">
            <div className="flex items-center gap-1 ">
            <p className="text-xs font-xs">Départ : </p>
            <p className="text-sm">{item.departHeure}</p>
            </div>
            <div className='flex items-center gap-1'>
            <p className="text-xs font-xs">Arrivée : </p>
            <p className="text-sm">{item.arriveeHeure}</p>
            </div>
            <div>
              <h3 className=' font-bold text-3xl  mt-8 w-30 text-left -ml-6' >{item.prix} €</h3>
            </div>
        </div>
        
    </div>
      

    {/* Infos siège */}
    <div className=" flex items-center justify-between mb-4">
      <div className=" grid-cols w-40 gap-4 ">
        <div className='flex items-center gap-4 mt-3'>
          <img src={terIco} alt="" />
          <p className="text-sm font-bold ">Train : TER</p>
        </div>

        <div className='flex items-center gap-8 mt-2'>
          <img src={SiègeIco} alt="" />
          <p className="text-sm font-bold">Place : <span className="font-semibold">{item.siegeRestant}</span></p>
        </div>

        <div className='flex items-center mt-2'>
          <p className="text-xl font-bold">Classe : <span className="font-semibold">{item.classe}</span></p>
        </div>
      </div>
        <button onClick={handleDeletePanierItem} className='cursor-pointer'>
          <img src={trashcan} alt="trash can icon " className='w-12 h-12 mt-3' />
        </button>
      </div>
    </div>
  );
}
