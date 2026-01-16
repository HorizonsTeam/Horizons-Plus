export const PARIS_HUBS = {
    station: {
        kind: "station",
        city: "Paris",
        placeName: "Paris Gare de Lyon",
        lat: 48.8449,
        lng: 2.3736
    },
    airport: {
        kind: "airport",
        city: "Paris",
        placeName: "Paris Charles de Gaulle Airport (CDG)",
        lat: 49.0097,
        lng: 2.5479
    }
};

export const TRANSFER_TIME_MINUTES = 45;

export const JOURNEY_CONFIG = {
    lastDepartureAllowed: 20 * 60,
    intervalMinutes: 120,
    speedKmPerHour: 800,
    hubDistanceThreshold: 800
};

// Liste des villes/aéroports éligibles pour les vols fictifs
export const FLIGHT_ELIGIBLE_CITIES = [
    // France - Villes
    "Paris",
    "Lyon", 
    "Marseille",
    "Nice",
    "Toulouse",
    "Bordeaux",
    "Nantes",
    "Strasbourg",
    
    // France - Aéroports
    "Charles De Gaulle",
    "Orly",
    
    // Europe - Villes
    "Madrid",
    "Barcelona",
    "München",
    "Berlin",
    "Frankfurt",
    "Amsterdam",
    "Brussels",
    "Rome",
    "Milan",
    "Zurich",
    "London",
];

export function shouldGenerateFlightAlternative(fromName, toName) {
    // Normalise les noms (enlève les accents, met en minuscule, enlève "(France)" etc.)
    const normalizeCity = (name) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Enlève accents
            .replace(/\(.*?\)/g, "") // Enlève les parenthèses (France)
            .trim();
    };
    
    const normalizedFrom = normalizeCity(fromName);
    const normalizedTo = normalizeCity(toName);

    console.log("normalized from ", normalizedFrom);
    console.log("normalized to ", normalizedTo);

    // Vérifie si les deux villes sont dans la liste
    const fromMatch = FLIGHT_ELIGIBLE_CITIES.some(city => 
        normalizedFrom.includes(normalizeCity(city)) || 
        normalizeCity(city).includes(normalizedFrom)
    );
    
    const toMatch = FLIGHT_ELIGIBLE_CITIES.some(city => 
        normalizedTo.includes(normalizeCity(city)) || 
        normalizeCity(city).includes(normalizedTo)
    );
    
    return fromMatch && toMatch;
}