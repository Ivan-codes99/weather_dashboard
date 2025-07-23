import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TOP_CITIES from './topCities';

function DetailView() {
  const { city } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_WEATHERBIT_API_KEY;
        // Try to find the country code for the city (for more accurate API call)
        // We'll use a static list for now, but ideally this would be imported from a shared file
        const cityObj = TOP_CITIES.find(c => c.name === city);
        if (!cityObj) throw new Error('City not found');
        const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(cityObj.name)}&country=${cityObj.country}&key=${apiKey}`);
        const json = await response.json();
        if (!json.data || !json.data[0]) throw new Error('No weather data found');
        setData(json.data[0]);
      } catch (err) {
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCityWeather();
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
      <p><strong>Humidity:</strong> {data.rh}%</p>
      <p><strong>Wind Speed:</strong> {data.wind_spd} m/s</p>
      <p><strong>Pressure:</strong> {data.pres} mb</p>
      <p><strong>Visibility:</strong> {data.vis} km</p>
      {/* Add any other interesting fields from the API */}
    </div>
  );
}

export default DetailView; 