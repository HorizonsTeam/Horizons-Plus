import CityMap from './cityMap';
import villesData from './villesData.json';

const getCityFeature = (cityName: string) => {
  return villesData.features.find(
    f => f.properties?.name?.toLowerCase() === cityName.toLowerCase()
  );
};

const Ville = () => {
  const cityName = 'Rome'; // Tu peux le rendre dynamique plus tard
  const feature = getCityFeature(cityName);

  if (!feature) return <p>Ville "{cityName}" non trouvée.</p>;

  return <CityMap feature={feature} />;
};

export default Ville;
