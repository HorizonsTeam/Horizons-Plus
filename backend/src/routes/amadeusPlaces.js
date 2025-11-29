import express from "express";
import amadeus from "../amadeusClient.js";

const amadeusPlaces = express.Router();

amadeusPlaces.get("/airports", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json([]);

    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: q,
            subType: "AIRPORT,CITY"
        });

        const data = response.data || [];

        // const places = data.map((place) => ({
        //     id: place.id,
        //     name: place.name,
        //     iata: place.iataCode,
        //     type: place.subType,
        //     country: place.address?.countryName || null,
        // }));

        // res.json(places);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

export default amadeusPlaces;