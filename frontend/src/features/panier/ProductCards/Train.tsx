import TrainIco from '../../../assets/train_icon.svg';
import mobigoIco from '../../../assets/mobigo_ico.svg';

export default function TrainCard() {
  return (
    <div className="max-w-md mx-auto bg-[#133A40] rounded-lg shadow-md p-4 text-sm text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src={TrainIco} alt="Train icon" className="h-5 w-5" />
          <img src={mobigoIco} alt="Mobigo logo" className="h-5 w-5" />
        </div>
        <span className="text-xs">Jeudi 18 Septembre 2025</span>
      </div>

      
    <div className='flex items-center justify-between'>
        {/* Trajet */}
        <div className="mb-4 w-50">
            <p className="text-xs mb-3 -ml-40">n°85530</p>
            <h2 className="text-lg font-semibold mb-1 text-left">Moulins-sur-Allier → Nevers</h2>
        </div>
        {/* Horaires sous la date */}
        <div className="grid grid-cols gap-2 w-20 -mt-20">
            <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Départ</p>
            <p className="text-sm">06:50</p>
            </div>
            <div className='flex items-center justify-between'>
            <p className="text-xs font-medium">Arrivée</p>
            <p className="text-sm">07:37</p>
            </div>
        </div>
        <h3>10,50 €</h3>
    </div>
      

      {/* Infos siège */}
      <div className=" grid-cols w-20">
        <p className="text-sm">Train : TER</p>
        <p className="text-sm">Place : <span className="font-semibold">17</span></p>
        <p className="text-sm">Class : <span className="font-semibold">2nd</span></p>

      </div>
    </div>
  );
}
