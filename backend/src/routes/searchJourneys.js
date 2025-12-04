import express from "express";

const searchJourneys = express.Router();

searchJourneys.get("/journeys", async (req, res) => {
    const departure = req.query.from;
    const arrival = req.query.to;
    const datetime = req.query.datetime;
    // const count = req.query.count || 6; // Faudra gérer ça plus tard pour la pagination

    if (!departure || !arrival || !datetime) {
        return res.status(400).json({ error: "Missing parameters ?from=&to=&datetime=" });
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

    try {
        console.log("Requête SNCF :", departure, "→", arrival);

        const response = await fetch(
            `https://api.sncf.com/v1/coverage/sncf/journeys?from=${departure}&to=${arrival}&datetime=${datetime}&count=10`,
            {
                headers: {
                    "Authorization":
                        "Basic " +
                        Buffer.from(process.env.NAVITIA_API_KEY + ":").toString("base64")
                }
            }
        );



        const data = await response.json();
        
        if (data.error) { // On regarde si le retour API est pas "out of bounds"
            console.warn("Erreur API SNCF :", data.error);
            return res.status(404).json({
                error: data.error.message || "No journeys found",
                code: data.error.id
            });
        }

        if (!data.journeys || data.journeys.length === 0) {
            return res.status(404).json({ error: "No journeys available" });
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
            }
        });

        return res.json(JourneyList);

    } catch (err) {
        console.error("Erreur API SNCF :", err);
        return res.status(500).json({ error: "API SNCF error" });
    }
});

export default searchJourneys;
