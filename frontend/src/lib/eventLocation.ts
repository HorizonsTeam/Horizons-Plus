// utils/eventLocation.ts
import type { Suggestion } from "../components/autocomplete/types";

const API_BASE_ = import.meta.env.VITE_API_URL || "";

function pickBestCitySuggestion(results: Suggestion[]): Suggestion | null {
  const cities = results.filter(
    (r) => r.type === "city" && Number(r.lat) !== 0 && Number(r.lon) !== 0
  );

  if (cities.length > 0) return cities[0];

  const anyValid = results.find(
    (r) => Number(r.lat) !== 0 && Number(r.lon) !== 0
  );

  return anyValid || null;
}

export async function resolveDestinationFromCity(
  cityName: string
): Promise<Suggestion | null> {
  if (!cityName?.trim()) return null;

  try {
    const stationsRes = await fetch(
      `${API_BASE_}/api/search/stations?q=${encodeURIComponent(cityName)}`
    );
    const stationsData: Suggestion[] = await stationsRes.json();
    const fromStations = pickBestCitySuggestion(
      Array.isArray(stationsData) ? stationsData : []
    );

    if (fromStations) return fromStations;
  } catch (err) {
    console.error("Erreur recherche gares pour", cityName, err);
  }

  try {
    const airportsRes = await fetch(
      `${API_BASE_}/api/search/airports?q=${encodeURIComponent(cityName)}`
    );
    const airportsData: Suggestion[] = await airportsRes.json();
    const fromAirports = pickBestCitySuggestion(
      Array.isArray(airportsData) ? airportsData : []
    );

    if (fromAirports) return fromAirports;
  } catch (err) {
    console.error("Erreur recherche aéroports pour", cityName, err);
  }

  return null;
}

const VENUE_TO_CITY_FALLBACK: Record<string, string> = {
  "stade raymond kopa": "Angers",
};

async function resolveCityFromVenueName(venueName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchvenues.php?v=${encodeURIComponent(
        venueName
      )}`
    );
    const data = await res.json();
    const venue = data?.venues?.[0];

    const city = venue?.strCity || venue?.strLocation || venue?.strCountry;

    return city || null;
  } catch (err) {
    console.error("Erreur résolution venue->ville pour", venueName, err);
    return null;
  }
}

export async function guessSearchableCityName(event: {
  strVenue?: string;
  strCountry?: string;
}): Promise<string | null> {
  const venueKey = event.strVenue?.trim().toLowerCase();

  if (venueKey && VENUE_TO_CITY_FALLBACK[venueKey]) {
    return VENUE_TO_CITY_FALLBACK[venueKey];
  }

  if (event.strVenue) {
    const cityFromApi = await resolveCityFromVenueName(event.strVenue);
    if (cityFromApi) return cityFromApi;
  }

  return event.strCountry || null;
}