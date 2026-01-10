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

function buildJourneyStopsAndLegs(from, to, currentDeparture, parisArrival, arrivalMinutes, distanceKm) {
    const requiresHub = needsParisHub(from, to, distanceKm);

    if (!requiresHub) {
        return buildDirectJourney(from, to, currentDeparture, arrivalMinutes);
    }

    const firstMode = getTransportMode(from.source);
    const secondMode = getTransportMode(to.source);
    const requiresTransfer = needsTransferBetweenHubs(firstMode, secondMode);

    if (requiresTransfer) {
        return buildHubJourneyWithTransfer(from, to, currentDeparture, parisArrival, arrivalMinutes);
    }

    return buildHubJourneyWithoutTransfer(from, to, currentDeparture, parisArrival, arrivalMinutes);
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