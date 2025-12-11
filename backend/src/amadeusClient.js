import fetch from "node-fetch";
import "dotenv/config";

let token = null;
let tokenExpires = null;

async function getToken() {
  const now = Date.now();
  if (token && tokenExpires && now < tokenExpires) {
    return token;
  }

  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET
    })
  });

  const data = await res.json();
  token = data.access_token;
  tokenExpires = now + data.expires_in * 1000 - 5000;
  return token;
}

export async function searchAirportsAndCities(params) {
  const accessToken = await getToken();
  const url = new URL("https://test.api.amadeus.com/v1/reference-data/locations");

  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  const data = await res.json();
  return data.data || [];
}
