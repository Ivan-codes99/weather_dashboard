import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TOP_CITIES from './topCities';
import MOCK_WEATHER_DATA from './mockWeatherData'; // ✅ Import mock data

function DetailView() {
  const { city } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const cityObj = TOP_CITIES.find(c => c.name === city);
      if (!cityObj) throw new Error('City not found');

      const matchedData = MOCK_WEATHER_DATA.find(
        entry => entry.city_name === city && entry.country_code === cityObj.country
      );

      if (!matchedData) throw new Error('No mock weather data found for this city');

      setData(matchedData);
    } catch (err) {
      setError('Failed to load mock weather data.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data) return <div>No data found.</div>;

  return (
    <div className="detail-view">
      <Link to="/">&larr; Back to Dashboard</Link>
      <h2>{data.city_name}, {data.country_code}</h2>
      <img
        src={`https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`}
        alt={data.weather.description}
        width={64}
        height={64}
      />
      <p><strong>Temperature:</strong> {data.temp}°C</p>
      <p><strong>Condition:</strong> {data.weather.description}</p>
      <p><strong>Humidity:</strong> {data.humidity}%</p>
      <p><strong>Wind Speed:</strong> {data.wind_spd} m/s</p>
      <p><strong>Pressure:</strong> {data.pres} mb</p>
      <p><strong>Visibility:</strong> {data.vis} km</p>
    </div>
  );
}

export default DetailView;
