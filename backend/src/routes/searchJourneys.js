import express from "express";
import { formatDuration } from "../utils/time.js";
import { calculerPrixFictif } from "../utils/price.js";
import { analyzeJourney, computeJourneyDistanceMeters } from "../services/journey/journey.analyzer.js";
import { generationJourneysFictif } from "../services/journey/journey.factory.js";
import { parseJourneySections } from "../services/journey/journey.parser.js";
import { shouldGenerateFlightAlternative } from "../utils/config.js";

const searchJourneys = express.Router();

searchJourneys.get("/journeys", async (req, res) => {
    const {
        fromId, fromName, toId, toName, datetime,
        fromLat, toLat, fromLon, toLon,
        fromSource, toSource,
    } = req.query;

    console.log("la query : ", req.query);

    if (
        !fromId || !fromName || !toId || !toName || !datetime ||
        !fromLat || !toLat || !fromLon || !toLon ||
        !fromSource || !toSource
    ) {
        return res.status(400).json({ 
            error: "Missing required parameters" 
        });
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

        // CAS 1A : Erreur API SNCF (clé invalide, rate limit, serveur KO)
        if (data.error && data.error.id !== "no_solution") {
            console.log("Erreur API SNCF réelle → génération fictive");
            return res.json(
                generationJourneysFictif({
                    from: { name: fromName, lat: Number(fromLat), lon: Number(fromLon), source: fromSource },
                    to: { name: toName, lat: Number(toLat), lon: Number(toLon), source: toSource },
                })
            );
        }

        // CAS 1B : Pas de solution trouvée (trajet impossible / pas de train)
        if (data.error && data.error.id === "no_solution") {
            console.log("Aucun trajet SNCF disponible → renvoi []");
            return res.json([]);
        }

        // CAS 1C : Pas de journeys mais pas d’erreur
        if (!data.journeys || data.journeys.length === 0) {
            console.log("Journeys vide → renvoi []");
            return res.json([]);
        }

        // CAS 2 : Résultats SNCF existent -> on les mappe
        const sncfJourneys = data.journeys.map((journey) => {
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

            let price;

            if (journey.fare?.total?.value != null && journey.fare.total.value > 0) {
                price = (journey.fare.total.value / 100).toFixed(2);
            } else {
                price = calculerPrixFictif(distanceM, numberOfTransfers, trainType);
            }

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

        // CAS 3 : Si départ ET arrivée dans la liste -> ajout des vols fictifs
        let finalJourneys = [...sncfJourneys];

        if (shouldGenerateFlightAlternative(fromName, toName)) {
            console.log("lala\n\n\n")
            const flightJourneys = generationJourneysFictif({
                from: {
                    name: fromName,
                    lat: Number(fromLat),
                    lon: Number(fromLon),
                    source: "amadeus"
                },
                to: {
                    name: toName,
                    lat: Number(toLat),
                    lon: Number(toLon),
                    source: "amadeus"
                },
            });

            finalJourneys = [...sncfJourneys, ...flightJourneys].sort((a, b) => {
                const timeA = a.departureTime.replace(":", "");
                const timeB = b.departureTime.replace(":", "");
                return parseInt(timeA) - parseInt(timeB);
            })
        }

        return res.json(finalJourneys);

    } catch (err) {
        console.error("Erreur API SNCF :", err);
        return res.status(500).json({ error: "API SNCF error" });
    }
});

export default searchJourneys;