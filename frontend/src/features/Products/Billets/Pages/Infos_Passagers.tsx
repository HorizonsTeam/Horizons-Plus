import ReturnBtn from '../../../../assets/ReturnBtn.svg';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import Passagers_Data_From from '../components/Passager_info/Passagers_DataForm.tsx';
import { useState } from 'react';
import type { LocationState } from '../types.ts';

export default function Infos_Passagers() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { journey, selectedClass, passagersCount, formattedDepartureDate } = (state || {}) as LocationState;

  const handleretour = () => navigate(-1);

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
    <div className="flex-wrap m-2 p-3  -mt-3 ">
      <div className="m-2 p-3 -mt-3  ">
        <div className="relative mt-4 flex justify-center items-center">
          <button onClick={handleretour}>
            <img
              src={ReturnBtn}
              alt="Return Button"
              className="absolute left-0 -translate-x-1/2 mx-4 transform"
            />
          </button>
          <h1 className="text-3xl text-[#98EAF3] font-medium text-center">
            Informations voyageurs
          </h1>
        </div>
      </div>

      {passagers.map((num) => (
        <Passagers_Data_From
          key={num}
          passagerIndex={num}
          suprimer_Passager={() => Supprimer_Passager(num)}
          onChange={(data) => updatePassager(num, data)}
        />
      ))}

      <div className="w-full items-center bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 p-4 mb-8">
        <button className="w-full" onClick={Ajouter_Passager}>
          <div className="flex justify-between">
            <p className="font-bold mt-1">Autre passager</p>
            <div className="h-8 w-8 bg-white rounded-2xl flex justify-center items-center ">
              <h1 className="text-[#133A40] text-4xl font-bold">+</h1>
            </div>
          </div>
        </button>
      </div>
      <div  className='flex justify-center'>
      <Link
        to="/PaymentPage"
        state={{ journey, selectedClass, passagersCount: passagers.length, formattedDepartureDate, passagersData, }}
      >
        <button className="w-80 h-15 bg-[#98EAF3] rounded-xl mt-4 ml-3">
          <span className="text-[#115E66] font-bold text-xl">Continuer</span>
        </button>
      </Link>
    </div>
    </div>
  );
}