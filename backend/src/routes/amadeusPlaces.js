import express from "express";
import { searchAirportsAndCities } from "../amadeusClient.js";

const router = express.Router();

function capitalizeWithHyphens(str) { 
    return str 
        .toLowerCase() 
        .replace(/(^\p{L})|([\s-]\p{L})/gu, c => c.toUpperCase()); 
}

router.get("/airports", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  try {
    const results = await searchAirportsAndCities({
      keyword: q,
      subType: "AIRPORT,CITY",
    });

    const placesList = results.map(p => { 
        const name = capitalizeWithHyphens(p.name); 
        const type = p.subType.toLowerCase(); 
        const countryName = new Intl.DisplayNames(['fr'], { type: "region" }); 
        const country = capitalizeWithHyphens(countryName.of(p.address.countryCode)); 
        
        return { id: p.id, name, type, country }; 
    });

    res.json(placesList);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

export default router;
