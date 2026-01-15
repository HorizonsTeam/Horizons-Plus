export interface Reservation {
  reservation_id: number;
  ticket_id: string;
  customer_name: string;
  journey: string;
  date: string;
  time: string;
  passengers: number;
  price: number;
}

export type TabType = "upcoming" | "past";

// Types pour les props des composants
export interface ReservationCardProps {
  reservation: Reservation;
  activeTab: TabType;
  downloadingId: number | null;
  onDownload: (reservation: Reservation) => void;
}

export interface TabButtonProps {
  type: TabType;
  label: string;
  count: number;
  activeTab: TabType;
  onClick: (type: TabType) => void;
}

// Types pour les fonctions utilitaires
export interface OrganizedReservations {
  upcoming: Reservation[];
  past: Reservation[];
}