import express from "express";

const searchJourneys = express.Router();

searchJourneys.get("/journeys", async (req, res) => {
    const departure = req.query.from;
    const arrival = req.query.to;
    const datetime = req.query.datetime || "2025-11-25"; // format navitia

    if (!departure || !arrival) {
        return res.status(400).json({ error: "Missing parameters ?from=&to=" });
    }

    try {
        console.log("Requête SNCF :", departure, "→", arrival);

        const response = await fetch(
            `https://api.sncf.com/v1/coverage/sncf/journeys?from=${departure}&to=${arrival}&datetime=${datetime}`,
            {
                headers: {
                    "Authorization":
                        "Basic " +
                        Buffer.from(process.env.NAVITIA_API_KEY + ":").toString("base64")
                }
            }
        );

        const data = await response.json();

        console.log("Réponse SNCF OK");

        return res.json(data);

    } catch (err) {
        console.error("Erreur API SNCF :", err);
        return res.status(500).json({ error: "API SNCF error" });
    }
});

export default searchJourneys;
