import express from "express";
import { formatDuration } from "../utils/time.js";
import { calculerPrixFictif } from "../utils/price.js";
import { analyzeJourney, computeJourneyDistanceMeters } from "../services/journey/journey.analyzer.js";
import { generationJourneysFictif } from "../services/journey/journey.factory.js";

const searchJourneys = express.Router();

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
        fromSource,
        toSource,
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
        !toLon ||
        !fromSource ||
        !toSource
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
                    from: { name: fromName, lat: Number(fromLat), lon: Number(fromLon), source: fromSource },
                    to: { name: toName, lat: Number(toLat), lon: Number(toLon), source: toSource },
                })
            );
        }

        const JourneyList = data.journeys.map((journey) => {
            const { stops, legs } = parseJourneySections(journey);
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
                stops,
                legs
            };
        });

        return res.json(JourneyList);

    } catch (err) {
        console.error("Erreur API SNCF :", err);
        return res.status(500).json({ error: "API SNCF error" });
    }
});

export default searchJourneys;