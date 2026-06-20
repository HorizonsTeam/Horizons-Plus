import { getRegionByInsee } from "../../utils/geoData.js";
import { pickClosestByName } from "./levenshtein.js";

const NAVITIA_BASE = "https://api.sncf.com/v1/coverage/sncf/places";

function authHeader() {
  return "Basic " + Buffer.from(process.env.NAVITIA_API_KEY + ":").toString("base64");
}

function mapPlace(p) {
  let type = "other";
  let regionName = null;
  let lat = 0;
  let lon = 0;

  if (p.embedded_type === "stop_area") {
    type = "stop_area";
    const region = p.stop_area?.administrative_regions?.[0]?.insee;
    regionName = region ? getRegionByInsee(region) : "Hors France";
    lat = p.stop_area.coord.lat;
    lon = p.stop_area.coord.lon;
  } else if (p.embedded_type === "administrative_region") {
    type = "city";
    const region = p.administrative_region?.insee;
    regionName = region ? getRegionByInsee(region) : "Hors France";
    lat = p.administrative_region.coord.lat;
    lon = p.administrative_region.coord.lon;
  }

  return {
    id: p.id,
    name: p.name.replace(/\s*\(.*\)/, ""),
    type,
    region: regionName,
    source: "sncf",
    lat,
    lon,
  };
}

/**
 * Resolves a place name (e.g. "Marseille") to the top SNCF place result.
 * Returns null if the API returns nothing.
 */
export async function resolvePlaceByName(name) {
  if (!name || typeof name !== "string") return null;

  const url = `${NAVITIA_BASE}?q=${encodeURIComponent(name)}`;
  const response = await fetch(url, { headers: { Authorization: authHeader() } });
  const data = await response.json();
  const places = Array.isArray(data.places) ? data.places : [];
  if (places.length === 0) return null;

  // Tolérance aux fautes de frappe : plutôt que de prendre aveuglément le
  // premier résultat, on retient le candidat dont le nom est orthographiquement
  // le plus proche de ce que l'utilisateur a tapé (distance de Levenshtein).
  // Ex. "Nevrs" -> on garde "Nevers" même si l'API l'a classé plus bas.
  const best = pickClosestByName(name, places, (p) => p.name);
  return mapPlace(best);
}

/**
 * Resolves a geoloc point (lat, lon) to the nearest SNCF stop_area.
 * Returns null if nothing useful is found nearby.
 */
export async function resolvePlaceByCoords(lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number") return null;

  const url = `https://api.sncf.com/v1/coverage/sncf/coord/${lon};${lat}/places_nearby?type[]=stop_area&count=1`;
  const response = await fetch(url, { headers: { Authorization: authHeader() } });
  const data = await response.json();
  const places = Array.isArray(data.places_nearby) ? data.places_nearby : [];
  if (places.length === 0) return null;

  return mapPlace(places[0]);
}
