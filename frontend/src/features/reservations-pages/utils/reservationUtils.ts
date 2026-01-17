import type { Reservation, OrganizedReservations } from '../types/reservations';

export const createDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    const dateTimeStr = `${dateStr}T${timeStr}:00`;
    const date = new Date(dateTimeStr);
    
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    const timeParts = timeStr.split(':').map(Number);
    const hours = timeParts[0] || 0;
    const minutes = timeParts[1] || 0;
    
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      parsedDate.setHours(hours, minutes, 0, 0);
      return parsedDate;
    }
    
    return new Date('Invalid Date');
  } catch (error) {
    console.error("Erreur lors de la création de la date:", error);
    return new Date('Invalid Date');
  }
};

export const formatDisplayDate = (dateStr: string, timeStr: string): string => {
  try {
    const dateTime = createDateTime(dateStr, timeStr);
    if (!isNaN(dateTime.getTime())) {
      return dateTime.toLocaleDateString("fr-FR", { 
        weekday: "short", 
        day: "numeric", 
        month: "short" 
      });
    }
  } catch (error) {
    console.error("Erreur d'affichage de la date:", error);
  }
  return dateStr;
};

export const organizeReservations = (reservations: Reservation[]): OrganizedReservations => {
  const now = new Date();
  const upcoming: Reservation[] = [];
  const past: Reservation[] = [];

  reservations.forEach((reservation) => {
    try {
      const departureDateTime = createDateTime(reservation.date, reservation.time);
      
      if (isNaN(departureDateTime.getTime())) {
        console.warn(`Date invalide pour la réservation ${reservation.reservation_id}`);
        past.push(reservation);
        return;
      }
      
      if (departureDateTime > now) {
        upcoming.push(reservation);
      } else {
        past.push(reservation);
      }
    } catch (error) {
      console.error(`Erreur avec la réservation ${reservation.reservation_id}:`, error);
      past.push(reservation);
    }
  });

  upcoming.sort((a, b) => {
    const dateA = createDateTime(a.date, a.time);
    const dateB = createDateTime(b.date, b.time);
    return dateA.getTime() - dateB.getTime();
  });

  past.sort((a, b) => {
    const dateA = createDateTime(a.date, a.time);
    const dateB = createDateTime(b.date, b.time);
    return dateB.getTime() - dateA.getTime();
  });

  return { upcoming, past };
};