// components/ReservationCard.tsx
import type { ReservationCardProps } from '../types/reservations';
import { formatDisplayDate } from '../utils/reservationUtils';

export const ReservationCard = ({ 
  reservation, 
  activeTab, 
  downloadingId, 
  onDownload 
}: ReservationCardProps) => {
  const isDownloading = downloadingId === reservation.reservation_id;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-[#98EAF3] hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-[#103035] mb-1">{reservation.journey}</h3>
          <p className="text-gray-600 text-sm">ID Billet: {reservation.ticket_id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          activeTab === "upcoming" 
            ? "bg-green-100 text-green-700" 
            : "bg-gray-100 text-gray-700"
        }`}>
          {activeTab === "upcoming" ? "À venir" : "Passé"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Date</p>
          <p className="text-[#103035] font-semibold">
            {formatDisplayDate(reservation.date, reservation.time)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Heure</p>
          <p className="text-[#103035] font-semibold">{reservation.time}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Passagers</p>
          <p className="text-[#103035] font-semibold">{reservation.passengers}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Prix</p>
          <p className="text-[#103035] font-semibold">{parseFloat(String(reservation.price)).toFixed(2)} €</p>
        </div>
      </div>

      <button
        onClick={() => onDownload(reservation)}
        disabled={isDownloading}
        className={`w-full cursor-pointer px-4 py-3 rounded-lg font-semibold transition-all ${
          isDownloading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#98EAF3] hover:bg-[#7DDDE8] text-[#103035] hover:shadow-md"
        }`}
      >
        {isDownloading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Téléchargement...
          </span>
        ) : (
          "Télécharger le billet"
        )}
      </button>
    </div>
  );
};