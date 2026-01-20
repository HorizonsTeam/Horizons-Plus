import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Reservation, TabType } from "../types/reservations";
import { organizeReservations } from "../utils/reservationUtils";
import { ReservationCard } from "./ReservationCard";
import { ReservationTabs } from "./ReservationTabs";

export default function ReservationsPages() {
  const navigate = useNavigate();
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      setLoading(true);
      
      // Vérifier l'authentification d'abord
      const authResponse = await fetch(`${API_BASE}/api/me`, {
        credentials: "include",
      });

      if (authResponse.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      if (!authResponse.ok) {
        throw new Error("Erreur d'authentification");
      }

      await fetchReservations();
    } catch (error) {
      console.error("Erreur auth check:", error);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reservations`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        throw new Error("Erreur lors du chargement des réservations");
      }

      const data = await response.json();
      const { upcoming, past } = organizeReservations(data.reservations);
      
      setUpcomingReservations(upcoming);
      setPastReservations(past);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDownloadPDF = async (reservation: Reservation) => {
    try {
      setDownloadingId(reservation.reservation_id);
      const response = await fetch(`${API_BASE}/api/ticket/download/${reservation.ticket_id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors du téléchargement du billet");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `billet_${reservation.ticket_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de télécharger le billet");
    } finally {
      setDownloadingId(null);
    }
  };

  const renderLoadingState = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#103035] mb-6">Mes réservations</h1>
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#98EAF3] mb-4"></div>
        <p className="text-gray-600">Chargement de vos réservations...</p>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-[#0C2529] rounded-lg shadow p-8 text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Aucune réservation</h2>
        <p className="text-white mb-6">Vous n'avez aucune réservation pour le moment.</p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center bg-[#98EAF3] hover:bg-[#7DDDE8] text-[#103035] px-6 py-3 rounded-lg font-semibold transition hover:shadow-md"
      >
        Découvrir les destinations
      </button>
    </div>
  );

  const renderReservationsList = (reservations: Reservation[]) => {
    if (reservations.length === 0) {
      return (
        <div className="text-center py-12 bg-[#0C2529] rounded-lg">
          <p className="text-white">
            {activeTab === "upcoming" 
              ? "Aucune réservation à venir" 
              : "Aucune réservation passée"
            }
          </p>
        </div>
      );
    }

    return reservations.map((reservation) => (
      <ReservationCard
        key={reservation.reservation_id}
        reservation={reservation}
        activeTab={activeTab}
        downloadingId={downloadingId}
        onDownload={handleDownloadPDF}
      />
    ));
  };

  if (loading) return renderLoadingState();

  const hasReservations = upcomingReservations.length > 0 || pastReservations.length > 0;
  const currentReservations = activeTab === "upcoming" ? upcomingReservations : pastReservations;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mes réservations</h1>
        <p className="text-white-600">Consultez et gérez toutes vos réservations</p>
      </div>

      {!hasReservations ? (
        renderEmptyState()
      ) : (
        <>
          <ReservationTabs
            upcomingCount={upcomingReservations.length}
            pastCount={pastReservations.length}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="space-y-4">
            {renderReservationsList(currentReservations)}
          </div>
        </>
      )}
    </div>
  );
}