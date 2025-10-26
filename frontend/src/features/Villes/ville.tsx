import { useState } from 'react';
import CityMap from './cityMap';
import villesData from './villesData.json';

const getCityFeature = (cityName: string) => {
  return villesData.features.find(
    f => f.properties?.name?.toLowerCase() === cityName.toLowerCase()
  );
};

const Ville = () => {
  const [cityName, setCityName] = useState('Paris');
  const feature = getCityFeature(cityName);

  return (
    <>
      <select onChange={e => setCityName(e.target.value)} value={cityName}>
        {villesData.features.map(f => (
          <option key={f.properties.name} value={f.properties.name}>
            {f.properties.name}
          </option>
        ))}
      </select>

      {feature ? <CityMap feature={feature} /> : <p>Ville "{cityName}" non trouvée.</p>}
    </>
  );
};

export default Ville;
