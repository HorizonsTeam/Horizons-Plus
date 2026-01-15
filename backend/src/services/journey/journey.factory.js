import { haversineDistance } from "../../utils/distance.js";
import { minutesToHHMM, randomDepartureTime } from "../../utils/time.js";
import { randInt } from "../../utils/random.js";
import { calculateSimulatedPrice } from "../../utils/price.js";
import { PARIS_HUBS, TRANSFER_TIME_MINUTES, JOURNEY_CONFIG } from "../../utils/config.js";

// ==================== PURE HELPERS ====================

function createStop({ kind, city, placeName, arrival, lat, lng }) {
    return {
        kind,
        city,
        placeName,
        arrival,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    };
}

function createLeg(fromIndex, toIndex, mode) {
    return { fromIndex, toIndex, mode };
}

function getTransportMode(source) {
    return source === "sncf" ? "rail" : "air";
}

function getParisHub(transportMode) {
    return transportMode === "rail" ? PARIS_HUBS.station : PARIS_HUBS.airport;
}

function needsParisHub(from, to, distanceKm) {
    return from.source !== to.source || distanceKm > JOURNEY_CONFIG.hubDistanceThreshold;
}

function needsTransferBetweenHubs(firstMode, secondMode) {
    return firstMode !== secondMode;
}

function calculateJourneyTiming(distanceKm, currentDeparture, numberOfTransfers) {
    const baseDurationMinutes = Math.round((distanceKm / JOURNEY_CONFIG.speedKmPerHour) * 60);
    const transferPenalty = numberOfTransfers * 20;
    const variation = randInt(-5, 5);
    const totalDurationMinutes = Math.max(30, baseDurationMinutes + transferPenalty + variation);
    const arrivalMinutes = currentDeparture + totalDurationMinutes;
    const parisArrival = currentDeparture + Math.floor(totalDurationMinutes * 0.3);

    return { totalDurationMinutes, arrivalMinutes, parisArrival };
}

function isAlreadyInHub(location) {
    const locationName = location.name.toLowerCase();

    const parisHubNames = [
        "paris",
        "orly",
        "charles de gaulle",
        "cdg",
        "gare de lyon",
        "gare du nord",
        "gare montparnasse",
        "gare de l'est",
        "gare saint-lazare",
        "aeroport",
        "aéroport"
    ];
    
    return parisHubNames.some(hub => locationName.includes(hub));
}

function getStartingHub(location, transportMode) {
    if (isAlreadyInHub(location)) {
        return {
            kind: location.source === "sncf" ? "station" : "airport",
            city: location.name,
            placeName: location.name,
            lat: location.lat,
            lng: location.lon
        };
    }

    return getParisHub(transportMode);
}

// ==================== JOURNEY BUILDERS ====================

function buildDirectJourney(from, to, currentDeparture, arrivalMinutes) {
    const mode = getTransportMode(from.source);
    const kind = mode === "rail" ? "station" : "airport";

    const stops = [
        createStop({
            kind,
            city: from.name,
            placeName: from.name,
            arrival: minutesToHHMM(currentDeparture),
            lat: from.lat,
            lng: from.lon
        }),
        createStop({
            kind,
            city: to.name,
            placeName: to.name,
            arrival: minutesToHHMM(arrivalMinutes),
            lat: to.lat,
            lng: to.lon
        })
    ];

    const legs = [createLeg(0, 1, mode)];

    return { stops, legs };
}

function buildHubJourneyWithoutTransfer(from, to, currentDeparture, parisArrival, arrivalMinutes) {
    const firstMode = getTransportMode(from.source);
    const secondMode = getTransportMode(to.source);
    const parisHub = getParisHub(secondMode);

    const stops = [
        createStop({
            kind: firstMode === "rail" ? "station" : "airport",
            city: from.name,
            placeName: from.name,
            arrival: minutesToHHMM(currentDeparture),
            lat: from.lat,
            lng: from.lon
        }),
        createStop({
            ...parisHub,
            arrival: minutesToHHMM(parisArrival)
        }),
        createStop({
            kind: secondMode === "rail" ? "station" : "airport",
            city: to.name,
            placeName: to.name,
            arrival: minutesToHHMM(arrivalMinutes),
            lat: to.lat,
            lng: to.lon
        })
    ];

    const legs = [
        createLeg(0, 1, firstMode),
        createLeg(1, 2, secondMode)
    ];

    return { stops, legs };
}

function buildHubJourneyWithTransfer(from, to, currentDeparture, parisArrival, arrivalMinutes) {
    const firstMode = getTransportMode(from.source);
    const secondMode = getTransportMode(to.source);
    
    const isFromParis = isAlreadyInHub(from);
    const isToParis = isAlreadyInHub(to);
    
    // CAS 1 : Départ ET arrivée à Paris (Orly → Gare de Lyon)
    if (isFromParis && isToParis) {
        const startHub = getStartingHub(from, firstMode);
        const endHub = getStartingHub(to, secondMode);
        
        const stops = [
            createStop({
                ...startHub,
                arrival: minutesToHHMM(currentDeparture)
            }),
            createStop({
                ...endHub,
                arrival: minutesToHHMM(arrivalMinutes)
            })
        ];
        
        const legs = [createLeg(0, 1, "walking")];
        
        return { stops, legs };
    }
    
    // CAS 2 : Départ depuis Paris uniquement (Orly → Marseille)
    if (isFromParis && !isToParis) {
        const startHub = getStartingHub(from, firstMode);
        const secondHub = getParisHub(secondMode);
        
        // Si même type de hub (airport→airport ou station→station), pas de transfert
        if (startHub.kind === secondHub.kind) {
            const stops = [
                createStop({
                    ...startHub,
                    arrival: minutesToHHMM(currentDeparture)
                }),
                createStop({
                    kind: secondMode === "rail" ? "station" : "airport",
                    city: to.name,
                    placeName: to.name,
                    arrival: minutesToHHMM(arrivalMinutes),
                    lat: to.lat,
                    lng: to.lon
                })
            ];
            
            const legs = [createLeg(0, 1, secondMode)];
            
            return { stops, legs };
        }
        
        // Sinon, transfert nécessaire (Gare → CDG ou CDG → Gare)
        const transferArrival = currentDeparture + TRANSFER_TIME_MINUTES;
        
        const stops = [
            createStop({
                ...startHub,
                arrival: minutesToHHMM(currentDeparture)
            }),
            createStop({
                ...secondHub,
                arrival: minutesToHHMM(transferArrival)
            }),
            createStop({
                kind: secondMode === "rail" ? "station" : "airport",
                city: to.name,
                placeName: to.name,
                arrival: minutesToHHMM(arrivalMinutes),
                lat: to.lat,
                lng: to.lon
            })
        ];
        
        const legs = [
            createLeg(0, 1, "walking"),
            createLeg(1, 2, secondMode)
        ];
        
        return { stops, legs };
    }
    
    // CAS 3 : Arrivée à Paris uniquement (Munich → Gare de Lyon)
    if (!isFromParis && isToParis) {
        const firstHub = getParisHub(firstMode);
        const endHub = getStartingHub(to, secondMode);
        
        // Si même type de hub, pas de transfert
        if (firstHub.kind === endHub.kind) {
            const stops = [
                createStop({
                    kind: firstMode === "rail" ? "station" : "airport",
                    city: from.name,
                    placeName: from.name,
                    arrival: minutesToHHMM(currentDeparture),
                    lat: from.lat,
                    lng: from.lon
                }),
                createStop({
                    ...endHub,
                    arrival: minutesToHHMM(arrivalMinutes)
                })
            ];
            
            const legs = [createLeg(0, 1, firstMode)];
            
            return { stops, legs };
        }
        
        // Sinon, transfert nécessaire
        const transferArrival = parisArrival + TRANSFER_TIME_MINUTES;
        
        const stops = [
            createStop({
                kind: firstMode === "rail" ? "station" : "airport",
                city: from.name,
                placeName: from.name,
                arrival: minutesToHHMM(currentDeparture),
                lat: from.lat,
                lng: from.lon
            }),
            createStop({
                ...firstHub,
                arrival: minutesToHHMM(parisArrival)
            }),
            createStop({
                ...endHub,
                arrival: minutesToHHMM(transferArrival)
            })
        ];
        
        const legs = [
            createLeg(0, 1, firstMode),
            createLeg(1, 2, "walking")
        ];
        
        return { stops, legs };
    }
    
    // CAS 4 : Cas normal (ni départ ni arrivée à Paris)
    const firstHub = getParisHub(firstMode);
    const secondHub = getParisHub(secondMode);
    const transferArrival = parisArrival + TRANSFER_TIME_MINUTES;

    const stops = [
        createStop({
            kind: firstMode === "rail" ? "station" : "airport",
            city: from.name,
            placeName: from.name,
            arrival: minutesToHHMM(currentDeparture),
            lat: from.lat,
            lng: from.lon
        }),
        createStop({
            ...firstHub,
            arrival: minutesToHHMM(parisArrival)
        }),
        createStop({
            ...secondHub,
            arrival: minutesToHHMM(transferArrival)
        }),
        createStop({
            kind: secondMode === "rail" ? "station" : "airport",
            city: to.name,
            placeName: to.name,
            arrival: minutesToHHMM(arrivalMinutes),
            lat: to.lat,
            lng: to.lon
        })
    ];

    const legs = [
        createLeg(0, 1, firstMode),
        createLeg(1, 2, "walking"),
        createLeg(2, 3, secondMode)
    ];

    return { stops, legs };
}

function cleanupRedundantStops(stops, legs) {
    // CAS 1 : Détecter les stops de même ville consécutifs au début
    if (stops.length >= 2) {
        const firstStop = stops[0];
        const secondStop = stops[1];
        
        // Si les 2 premiers stops sont dans la même ville ET très proches
        const isSameCity = firstStop.city.toLowerCase() === secondStop.city.toLowerCase();
        const distance = haversineDistance(
            firstStop.lat, 
            firstStop.lng, 
            secondStop.lat, 
            secondStop.lng
        );
        
        // Si même ville et < 15km de distance → on supprime le premier
        if (isSameCity && distance < 15) {
            // Supprime le premier stop
            stops.shift();
            
            // Supprime le premier leg
            legs.shift();
            
            // Réindexe tous les legs
            legs.forEach(leg => {
                leg.fromIndex = Math.max(0, leg.fromIndex - 1);
                leg.toIndex = Math.max(0, leg.toIndex - 1);
            });
        }
    }
    
    return { stops, legs };
}

function buildJourneyStopsAndLegs(from, to, currentDeparture, parisArrival, arrivalMinutes, distanceKm) {
    const requiresHub = needsParisHub(from, to, distanceKm);

    if (!requiresHub) {
        return buildDirectJourney(from, to, currentDeparture, arrivalMinutes);
    }

    const firstMode = getTransportMode(from.source);
    const secondMode = getTransportMode(to.source);
    const requiresTransfer = needsTransferBetweenHubs(firstMode, secondMode);

    let result;
    if (requiresTransfer) {
        result = buildHubJourneyWithTransfer(from, to, currentDeparture, parisArrival, arrivalMinutes);
    } else {
        result = buildHubJourneyWithoutTransfer(from, to, currentDeparture, parisArrival, arrivalMinutes);
    }
    
    return cleanupRedundantStops(result.stops, result.legs);
}

function formatJourneyDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

function createJourneyObject(from, to, stops, legs, currentDeparture, arrivalMinutes, totalDurationMinutes, distanceKm, numberOfTransfers) {
    return {
        departureName: from.name,
        arrivalName: to.name,
        departureTime: minutesToHHMM(currentDeparture),
        arrivalTime: minutesToHHMM(arrivalMinutes),
        duration: formatJourneyDuration(totalDurationMinutes),
        price: calculateSimulatedPrice(distanceKm),
        numberOfTransfers,
        simulated: true,
        stops,
        legs
    };
}

// ==================== MAIN EXPORT ====================

export function generationJourneysFictif({ from, to }) {
    const distanceKm = haversineDistance(from.lat, from.lon, to.lat, to.lon);
    const requiresHub = needsParisHub(from, to, distanceKm);
    const numberOfTransfers = requiresHub ? 1 : 0;

    const journeys = [];
    let currentDeparture = randomDepartureTime();

    while (currentDeparture <= JOURNEY_CONFIG.lastDepartureAllowed) {
        const { totalDurationMinutes, arrivalMinutes, parisArrival } = calculateJourneyTiming(
            distanceKm,
            currentDeparture,
            numberOfTransfers
        );

        const { stops, legs } = buildJourneyStopsAndLegs(
            from,
            to,
            currentDeparture,
            parisArrival,
            arrivalMinutes,
            distanceKm
        );

        const journey = createJourneyObject(
            from,
            to,
            stops,
            legs,
            currentDeparture,
            arrivalMinutes,
            totalDurationMinutes,
            distanceKm,
            numberOfTransfers
        );

        journeys.push(journey);
        currentDeparture += JOURNEY_CONFIG.intervalMinutes;
    }

    return journeys;
}