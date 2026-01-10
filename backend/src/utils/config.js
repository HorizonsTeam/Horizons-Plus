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