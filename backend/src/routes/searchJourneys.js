import express from "express";

const searchJourneys = express.Router();

// -------------------- Helpers --------------------

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

function analyzeJourney(journey) {
    const transportSections = journey.sections.filter(
        (section) => section.type === "public_transport"
    );
    return transportSections.length - 1;
}

function calculerPrixFictif(distanceM, nbTransfers, trainType) {
    const distanceKm = distanceM / 1000;
    const base = 5;
    const coeffDistance = 0.05;
    const coeffTransfert = 4;
    const coeffType = {
        "TER / Intercités": 1,
        "Train grande vitesse": 2,
    };

    let prix =
        base +
        distanceKm * coeffDistance +
        nbTransfers * coeffTransfert +
        (coeffType[trainType] || 1) * 5;

    return (Math.ceil(prix * 10) / 10).toFixed(2);
}

function toRadians(deg) {
    return deg * Math.PI / 180;
}

function haversineDistance(fromLat, fromLon, toLat, toLon) {
    const R = 6371;
    const dLat = toRadians(toLat - fromLat);
    const dLon = toRadians(toLon - fromLon);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(fromLat)) *
        Math.cos(toRadians(toLat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
}

function minutesToHHMM(totalMinutes) {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDepartureTime() {
    const hour = randInt(7, 8);
    const minute = randInt(0, 59);
    return hour * 60 + minute;
}

function generationJourneysFictif({ from, to }) {
    const distanceKm = haversineDistance(from.lat, from.lon, to.lat, to.lon);
    const baseDurationMinutes = Math.round((distanceKm / 800) * 60);
    const numberOfTransfers = distanceKm > 400 ? 1 : 0;
    const transferPenalty = numberOfTransfers * 20;

    let currentDeparture = randomDepartureTime();
    const journeys = [];
    const lastDepartureAllowed = 20 * 60;
    const intervalMinutes = 120;

    while (currentDeparture <= lastDepartureAllowed) {
        const variation = randInt(-5, 5);
        const totalDurationMinutes = Math.max(
        30,
        baseDurationMinutes + transferPenalty + variation
        );
        const arrivalMinutes = currentDeparture + totalDurationMinutes;

        journeys.push({
            departureName: from.name,
            arrivalName: to.name,
            departureTime: minutesToHHMM(currentDeparture),
            arrivalTime: minutesToHHMM(arrivalMinutes),
            duration: `${Math.floor(totalDurationMinutes / 60)}h${(
                totalDurationMinutes % 60
            )
                .toString()
                .padStart(2, "0")}`,
            price: (distanceKm * 0.12 + randInt(-30, 30)).toFixed(2),
            numberOfTransfers,
            simulated: true,
            distanceKm: Math.round(distanceKm),
        });

        currentDeparture += intervalMinutes;
    }

    return journeys;
}

function computeJourneyDistanceMeters(journey) {
    return journey.sections.reduce((total, section) => {
        // On ne prend que les sections qui ont un geojson avec des propriétés
        if (section.geojson?.properties) {
        const sumSection = section.geojson.properties.reduce(
            (sum, prop) => sum + (prop.length || 0),
            0
        );
        return total + sumSection;
        }
        return total;
    }, 0);
}

// -------------------- Route --------------------

searchJourneys.get("/journeys", async (req, res) => {
    const {
        fromId,
        fromName,
        toId,
        toName,
        datetime,
        fromLat,
        toLat,
        fromLon,
        toLon,
    } = req.query;

    if (
        !fromId ||
        !fromName ||
        !toId ||
        !toName ||
        !datetime ||
        !fromLat ||
        !toLat ||
        !fromLon ||
        !toLon
    ) {
        return res
        .status(400)
        .json({ error: "Missing parameters ?fromId=&toId=&datetime=..." });
    }

    try {
        const response = await fetch(
        `https://api.sncf.com/v1/coverage/sncf/journeys?from=${encodeURIComponent(
            fromId
        )}&to=${encodeURIComponent(
            toId
        )}&datetime=${encodeURIComponent(
            datetime
        )}&count=20`,
        {
            headers: {
            Authorization:
                "Basic " +
                Buffer.from(process.env.NAVITIA_API_KEY + ":").toString("base64"),
            },
        }
        );

        const data = await response.json();

        if (data.error || !data.journeys || data.journeys.length === 0) {
        return res.json(
            generationJourneysFictif({
            from: { name: fromName, lat: Number(fromLat), lon: Number(fromLon) },
            to: { name: toName, lat: Number(toLat), lon: Number(toLon) },
            })
        );
        }

        const JourneyList = data.journeys.map((journey) => {
            const firstSection = journey.sections[0].from;
            const lastSection = journey.sections[journey.sections.length - 1].to;

            const departureName =
                firstSection.administrative_region?.name ||
                firstSection.stop_area?.name ||
                firstSection.stop_point?.name ||
                firstSection.name;

            const arrivalName =
                lastSection.administrative_region?.name ||
                lastSection.stop_area?.name ||
                lastSection.stop_point?.name ||
                lastSection.name;

            const transportSection = journey.sections.find(
                (section) => section.type === "public_transport"
            );
            
            const distanceM = computeJourneyDistanceMeters(journey);
            const trainType = transportSection?.display_informations?.physical_mode || "TER";
            const numberOfTransfers = analyzeJourney(journey);

            const price =
                journey.fare?.total.value != 0
                ? (journey.fare.total.value / 100).toFixed(2)
                : calculerPrixFictif(distanceM, numberOfTransfers, trainType);

            const departureTime = journey.departure_date_time
                .split("T")[1]
                .slice(0, 4)
                .replace(/(\d{2})(\d{2})/, "$1:$2");

            const arrivalTime = journey.arrival_date_time
                .split("T")[1]
                .slice(0, 4)
                .replace(/(\d{2})(\d{2})/, "$1:$2");

            const duration = formatDuration(journey.duration);

            return {
                departureName,
                arrivalName,
                price,
                departureTime,
                arrivalTime,
                duration,
                numberOfTransfers,
                simulated: false,
            };
        });

        return res.json(JourneyList);

    } catch (err) {
        console.error("Erreur API SNCF :", err);
        return res.status(500).json({ error: "API SNCF error" });
    }
});

export default searchJourneys;