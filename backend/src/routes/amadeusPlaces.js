import express from "express";
import amadeus from "../amadeusClient.js";

const amadeusPlaces = express.Router();

function capitalizeWithHyphens(str) {
    return str
        .toLowerCase()
        .replace(/(^\p{L})|([\s-]\p{L})/gu, c => c.toUpperCase());
}


amadeusPlaces.get("/airports", async (req, res) => {
    const q = req.query.q;
    if (!q || q.length < 3 || q.length > 40) return res.json([]); 

    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: q,
            subType: "AIRPORT,CITY"
        });

        const data = response.data || [];

        const placesList = data.map(p => {
            const name = capitalizeWithHyphens(p.name);
            const type = p.subType.toLowerCase();
            const countryName = new Intl.DisplayNames(['fr'], { type: "region" });
            const region = capitalizeWithHyphens(countryName.of(p.address.countryCode));

            return { id: p.id, name, type, region };
        });

        res.json(placesList);
    } catch (err) {
        console.log(err);

        if (err.code === "ClientError" && err.description?.[0]?.status === 429) {
            console.warn("Amadeus rate limit exceeded, returning empty list");
            return res.json([]);
        }

        console.error(err);
        res.status(500).json([]);
    }
});

export default amadeusPlaces;