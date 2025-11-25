import express from "express";
import { getRegionByInsee } from "../utils/geoData.js";

const searchPlaces = express.Router();

    searchPlaces.get("/stations", async (req, res) => {
        const q = req.query.q;
        if (!q) return res.json([]);

        try {
            const response = await fetch(
            `https://api.sncf.com/v1/coverage/sncf/places?q=${q}`,
                {
                    headers: {
                        "Authorization": "Basic " + Buffer.from(process.env.NAVITIA_API_KEY + ":").toString("base64")
                    }
                }
            );

            const data = await response.json();
            console.log("Données reçues de l'API SNCF :", data);

            const places = Array.isArray(data.places) ? data.places : [];

            const placesList = places.map(p => {
                let type = 'other';
                let regionName = null;

                if (p.embedded_type === "stop_area") {
                    type = "stop_area";

                    const region = p.stop_area?.administrative_regions?.[0]?.insee;
                    regionName = region ? getRegionByInsee(region) : "Hors France";
                }
                else if (p.embedded_type === "administrative_region") {
                    type = "city";

                    const region = p.administrative_region?.insee;
                    regionName = region ? getRegionByInsee(region) : "Hors France";
                }

                return {
                    id: p.id,
                    name: p.name.replace(/\s*\(.*\)/, ""),
                    type,
                    region: regionName
                };
            });
            
            res.json(placesList);
            console.log("Stations trouvées :", placesList);

    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

export default searchPlaces;
