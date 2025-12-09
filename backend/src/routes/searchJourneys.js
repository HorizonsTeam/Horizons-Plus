import express from "express";

const searchJourneys = express.Router();

searchJourneys.get("/journeys", async (req, res) => {
    const departureId = req.query.fromId;
    const departureName = req.query.fromName;
    const arrivalId = req.query.toId;
    const arrivalName = req.query.toName;
    const datetime = req.query.datetime;
    const fromLat = req.query.fromLat;
    const toLat = req.query.toLat;
    const fromLon = req.query.fromLon;
    const toLon = req.query.toLon;

    // console.log("Params received:", {
    //     departureId,
    //     departureName,
    //     arrivalId,
    //     arrivalName,
    //     datetime,
    //     fromLat,
    //     toLat,
    //     fromLon,
    //     toLon
    // });

    if (!departureId || !departureName || !arrivalId || !arrivalName || !datetime || !fromLat || !toLat || !fromLon || !toLon) {
        return res.status(400).json({ error: "Missing parameters ?fromId=&toId=&datetime=..." });
    }

    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    }

    function analyzeJourney(journey) {
        const transportSections = journey.sections.filter(
            section => section.type === "public_transport"
        );

        const numberOfTransfers = transportSections.length - 1;

        return numberOfTransfers
    }

    const calculerPrixFictif = (
        distanceM,
        nbTransfers,
        trainType
    ) => {
        const distanceKm = distanceM / 1000;
        const base = 5;
        const coeffDistance = 0.05;
        const coeffTransfert = 2;
        const coeffType = {
            "TER / Intercités": 1,
            "Train grande vitesse": 4,
            
        };

        let prix =
            base +
            distanceKm * coeffDistance +
            nbTransfers * coeffTransfert +
            (coeffType[trainType] || 1) * 5;

        return Math.round(prix * 100) / 100; // Arrondi à 2 décimales
    };

    function toRadians(deg) {
    return deg * Math.PI / 180;
    }

    function haversineDistance(fromLat, fromLon, toLat, toLon) {
    const R = 6371; // rayon Terre en km

    const dLat = toRadians(toLat - fromLat);
    const dLon = toRadians(toLon - fromLon);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(fromLat)) *
        Math.cos(toRadians(toLat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c; // distance en km
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
        return hour * 60 + minute; // en minutes depuis 00:00
    }

    function generationJourneysFictif({ from, to }) {
        const distanceKm = haversineDistance(
            from.lat,
            from.lon,
            to.lat,
            to.lon
        );

        const baseDurationMinutes = Math.round(distanceKm / 800 * 60);
        const numberOfTransfers = distanceKm > 400 ? 1 : 0;
        const transferPenalty = numberOfTransfers * 20;

        // 1er départ
        let currentDeparture = randomDepartureTime(); // entre 07h et 08h59

        const journeys = [];
        const lastDepartureAllowed = 20 * 60; // 20h00
        const intervalMinutes = 120; // toutes les 2h

        while (currentDeparture <= lastDepartureAllowed) {
            // Petite variation réaliste par trajet
            const variation = randInt(-5, 5);

            const totalDurationMinutes = Math.max(
                30,
                baseDurationMinutes + transferPenalty + variation
            );

            const arrivalMinutes = currentDeparture + totalDurationMinutes;

            console.log(currentDeparture, arrivalMinutes);

            journeys.push({
                departureName,
                arrivalName,
                departureTime: minutesToHHMM(currentDeparture),
                arrivalTime: minutesToHHMM(arrivalMinutes),
                duration: `${Math.floor(totalDurationMinutes / 60)}h${(totalDurationMinutes % 60)
                    .toString()
                    .padStart(2, "0")}`,
                price: (distanceKm * 0.12 + randInt(-30, 30)).toFixed(2),
                numberOfTransfers,
                simulated: true,
                distanceKm: Math.round(distanceKm)
            });

            // prochain départ
            currentDeparture += intervalMinutes;
        }

        return journeys;
    }

    try {
        console.log("Requête SNCF :", departureName, "→", arrivalName);

        const response = await fetch(
            `https://api.sncf.com/v1/coverage/sncf/journeys?from=${encodeURIComponent(departureId)}&to=${encodeURIComponent(arrivalId)}&datetime=${encodeURIComponent(datetime)}&count=20`,
            {
                headers: {
                    "Authorization":
                        "Basic " +
                        Buffer.from(process.env.NAVITIA_API_KEY + ":").toString("base64")
                }
            }
        );

        const data = await response.json();
        
        if (data.error || !data.journeys || data.journeys.length === 0) {
            console.warn("SNCF indisponible → fallback fictif");

            return res.json(
                generationJourneysFictif({
                    from: {
                        name: departureName,
                        lat: Number(fromLat),
                        lon: Number(fromLon)
                    },
                    to: {
                        name: arrivalName,
                        lat: Number(toLat),
                        lon: Number(toLon)
                    }
                })
            );
        }

        const JourneyList = data.journeys.map((journey) => 
        {
            let departureName;
            if (journey.sections[0].from.embedded_type === "administrative_region") {
                departureName = journey.sections[0].from.administrative_region.name;
            }
            else if (journey.sections[0].from.embedded_type === "stop_area") {
                departureName = journey.sections[0].from.stop_area.name;
            }
            else if (journey.sections[0].from.embedded_type === "stop_point") {
                departureName = journey.sections[0].from.stop_point.name;
            }
            else {
                departureName = journey.sections[0].from.name;
            }
            
            let arrivalName;
            if (journey.sections[journey.sections.length - 1].to.embedded_type === "administrative_region") {
                arrivalName = journey.sections[journey.sections.length - 1].to.administrative_region.name;
            }
            else if (journey.sections[journey.sections.length - 1].to.embedded_type === "stop_area") {
                arrivalName = journey.sections[journey.sections.length - 1].to.stop_area.name;
            }
            else if (journey.sections[journey.sections.length - 1].to.embedded_type === "stop_point") {
                arrivalName = journey.sections[journey.sections.length - 1].to.stop_point.name;
            }
            else {
                arrivalName = journey.sections[journey.sections.length - 1].to.name;
            }

            const transportSection = journey.sections.find(
                (section) => section.type === "public_transport"
            );
            const distanceM = transportSection?.geojson?.properties?.[0]?.length || 0;
            const trainType = transportSection?.display_informations?.physical_mode || "TER";
            const numberOfTransfers = analyzeJourney(journey);

            let price = journey.fare?.total.value != 0 ? (journey.fare.total.value / 100).toFixed(2) : calculerPrixFictif(distanceM, numberOfTransfers, trainType);
            let departureTime = journey.departure_date_time.split('T')[1].slice(0, 4);
            departureTime = departureTime.slice(0,2) + ":" + departureTime.slice(2,4);
            let arrivalTime = journey.arrival_date_time.split('T')[1].slice(0, 4);
            arrivalTime = arrivalTime.slice(0, 2) + ":" + arrivalTime.slice(2, 4);
            let duration = journey.duration;
            duration = formatDuration(duration);

            console.log("Nombre de correspondances :", numberOfTransfers);

            console.log(`Trajet : ${departureName} → ${arrivalName}, Prix : ${price}, Départ : ${departureTime}, Arrivée : ${arrivalTime}, Durée : ${duration}, Nombre de correspondances : ${numberOfTransfers}`);

            return {
                departureName,
                arrivalName,
                price,
                departureTime,
                arrivalTime,
                duration,
                numberOfTransfers,
                simulated: false
            }
        });

        return res.json(JourneyList);

    } catch (err) {
        console.error("Erreur API SNCF :", err);
        return res.status(500).json({ error: "API SNCF error" });
    }
});

export default searchJourneys;
