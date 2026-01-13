import { useNavigate } from "react-router-dom";

export default function ReservationsPages() {
    const navigate = useNavigate();
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#103035] mb-6">Mes réservations</h1>
            
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Vous n'avez aucune réservation pour le moment.</p>
                <button 
                    onClick={() => navigate("/")}
                    className="mt-4 bg-[#98EAF3] text-[#103035] px-4 py-2 rounded-lg font-semibold hover:bg-[#7DDDE8] transition"
                >
                    Découvrir les destinations
                </button>
            </div>
        </div>
    );
}