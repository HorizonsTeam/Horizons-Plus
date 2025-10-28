// utils/geoUtils.ts
import fs from 'fs';
import path from 'path';

export async function fetchCityGeoJSON(cityName: string): Promise<any> {
  const query = `
    [out:json];
    relation["boundary"="administrative"]["name"="${cityName}"];
    out geom;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  const data = await response.json();
  return convertOverpassToGeoJSON(data);
}

function convertOverpassToGeoJSON(overpassData: any): any {
  const relation = overpassData.elements.find((el: any) => el.type === 'relation');
  if (!relation || !relation.geometry) return null;

  const coordinates = relation.geometry.map((point: any) => [point.lon, point.lat]);

  return {
    type: 'Feature',
    properties: { name: relation.tags.name },
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
}

export async function addCityToJson(cityName: string) {
  const feature = await fetchCityGeoJSON(cityName);
  if (!feature) return console.error('Ville non trouvée');

  const filePath = path.resolve(__dirname, '../Villes/villesData.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const villesData = JSON.parse(raw);

  villesData.features.push(feature);
  fs.writeFileSync(filePath, JSON.stringify(villesData, null, 2));
  console.log(`✅ ${cityName} ajoutée à villesData.json`);
}
