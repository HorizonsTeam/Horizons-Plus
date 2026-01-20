import { Link, useLocation } from 'react-router-dom';
import Passagers_Data_From from '../components/Passager_info/Passagers_DataForm.tsx';
import { useState, useEffect } from 'react';
import type { LocationState } from '../types.ts';
import Header from '../components/Header.tsx';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Infos_Passagers() {

  const { state } = useLocation();
  const { journey, selectedClass, passagersCount, formattedDepartureDate } = (state || {}) as LocationState;

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    fetch(`${API_BASE}/api/me`, { credentials: 'include' })
      .then((res) => (res.status === 401 ? null : res.json()))
      .then((data) => {
        console.log("User dans Infos_Passagers:", data);
        setCurrentUser(data?.user ?? data ?? null);
      })
      .catch(() => setCurrentUser(null));
  }, []);

 
  const [passagers, setPassagers] = useState<number[]>(Array.from({ length: passagersCount || 1 }, (_, i) => i + 1));

  const Ajouter_Passager = () => {
    setPassagers([...passagers, passagers.length + 1]);
  };

  const Supprimer_Passager = (num: number) => {
    setPassagers(passagers.filter(p => p !== num));
  };

  const [passagersData, setPassagersData] = useState<any[]>([]);

  const updatePassager = (index: number, data: any) => {
  setPassagersData((prev) => {
    const copy = [...prev];
    copy[index - 1] = data; 
    return copy;
  });
};

  return (
    <>
      <div className="w-full items-center  mt-10 p-4  mb-8">

      <Header Titre='Informations'/>

      <div className="w-full ">
      {passagers.map((num) => (
        <Passagers_Data_From
          key={num}
          passagerIndex={num}
          suprimer_Passager={() => Supprimer_Passager(num)}
          onChange={(data) => updatePassager(num, data)}
          user={currentUser} 
        />
      ))}
      </div>

      <div
        onClick={Ajouter_Passager}
        className="w-full cursor-pointer bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 p-4 mb-8"
      >
        <div className="flex justify-between">
          <p className="font-bold mt-1">Autre passager</p>
          <div className="h-8 w-8 bg-white rounded-2xl flex justify-center items-center">
            <h1 className="text-[#133A40] text-4xl font-bold">+</h1>
          </div>
        </div>
      </div>
      <div  className='flex justify-center'>
      <Link
        to="/PaymentPage"
        state={{ journey, selectedClass, passagersCount: passagers.length, formattedDepartureDate, passagersData, }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <button className="w-80 h-15 bg-[#98EAF3] rounded-xl mt-4 ml-3 cursor-pointer">
          <span className="text-[#115E66] font-bold text-xl">Continuer</span>
        </button>
      </Link>
    </div>
    </div>
    </>    
  );
}