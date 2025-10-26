import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CityFeature {
  type: string;
  properties: { name: string };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface Props {
  feature: CityFeature;
}

const getCenter = (coordinates: number[][]): LatLngExpression => {
  const lats = coordinates.map(c => c[1]);
  const lngs = coordinates.map(c => c[0]);
  return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
};

const CityMap = ({ feature }: Props) => {
  if (!feature || !feature.geometry?.coordinates?.length) {
    return <p>Aucune donnée géographique disponible.</p>;
  }

  const coords = feature.geometry.coordinates[0];
  const center: LatLngExpression = getCenter(coords);

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <GeoJSON
        data={feature}
        style={{ color: 'red', weight: 2 }}
        onEachFeature={(f, layer) => {
          layer.bindPopup(f.properties.name);
        }}
      />
    </MapContainer>
  );
};

export default CityMap;
