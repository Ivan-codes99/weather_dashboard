import { useState, useEffect } from 'react';
import './App.css';

const TOP_CITIES = [
  // Africa
  { name: "Lagos", country: "NG", continent: "Africa" },
  { name: "Cairo", country: "EG", continent: "Africa" },
  { name: "Kinshasa", country: "CD", continent: "Africa" },
  { name: "Luanda", country: "AO", continent: "Africa" },
  { name: "Johannesburg", country: "ZA", continent: "Africa" },
  { name: "Nairobi", country: "KE", continent: "Africa" },
  { name: "Casablanca", country: "MA", continent: "Africa" },
  { name: "Addis Ababa", country: "ET", continent: "Africa" },
  { name: "Abidjan", country: "CI", continent: "Africa" },
  { name: "Algiers", country: "DZ", continent: "Africa" },
  // Asia
  { name: "Tokyo", country: "JP", continent: "Asia" },
  { name: "Delhi", country: "IN", continent: "Asia" },
  { name: "Shanghai", country: "CN", continent: "Asia" },
  { name: "Mumbai", country: "IN", continent: "Asia" },
  { name: "Dhaka", country: "BD", continent: "Asia" },
  { name: "Jakarta", country: "ID", continent: "Asia" },
  { name: "Seoul", country: "KR", continent: "Asia" },
  { name: "Bangkok", country: "TH", continent: "Asia" },
  { name: "Manila", country: "PH", continent: "Asia" },
  { name: "Riyadh", country: "SA", continent: "Asia" },
  { name: "Singapore", country: "SG", continent: "Asia" },
  { name: "Kuala Lumpur", country: "MY", continent: "Asia" },
  { name: "Tehran", country: "IR", continent: "Asia" },
  { name: "Karachi", country: "PK", continent: "Asia" },
  { name: "Beijing", country: "CN", continent: "Asia" },
  { name: "Hong Kong", country: "HK", continent: "Asia" },
  // Europe
  { name: "Moscow", country: "RU", continent: "Europe" },
  { name: "London", country: "GB", continent: "Europe" },
  { name: "Paris", country: "FR", continent: "Europe" },
  { name: "Istanbul", country: "TR", continent: "Europe" },
  { name: "Madrid", country: "ES", continent: "Europe" },
  { name: "Berlin", country: "DE", continent: "Europe" },
  { name: "Rome", country: "IT", continent: "Europe" },
  { name: "Vienna", country: "AT", continent: "Europe" },
  { name: "Warsaw", country: "PL", continent: "Europe" },
  { name: "Budapest", country: "HU", continent: "Europe" },
  { name: "Athens", country: "GR", continent: "Europe" },
  { name: "Prague", country: "CZ", continent: "Europe" },
  { name: "Bucharest", country: "RO", continent: "Europe" },
  { name: "Hamburg", country: "DE", continent: "Europe" },
  // North America
  { name: "New York", country: "US", continent: "North America" },
  { name: "Los Angeles", country: "US", continent: "North America" },
  { name: "Mexico City", country: "MX", continent: "North America" },
  { name: "Toronto", country: "CA", continent: "North America" },
  { name: "Chicago", country: "US", continent: "North America" },
  { name: "Houston", country: "US", continent: "North America" },
  { name: "Montreal", country: "CA", continent: "North America" },
  { name: "Dallas", country: "US", continent: "North America" },
  { name: "Miami", country: "US", continent: "North America" },
  { name: "San Francisco", country: "US", continent: "North America" },
  { name: "Philadelphia", country: "US", continent: "North America" },
  { name: "Atlanta", country: "US", continent: "North America" },
  { name: "Vancouver", country: "CA", continent: "North America" },
  // South America
  { name: "São Paulo", country: "BR", continent: "South America" },
  { name: "Buenos Aires", country: "AR", continent: "South America" },
  { name: "Rio de Janeiro", country: "BR", continent: "South America" },
  { name: "Lima", country: "PE", continent: "South America" },
  { name: "Bogotá", country: "CO", continent: "South America" },
  { name: "Santiago", country: "CL", continent: "South America" },
  { name: "Caracas", country: "VE", continent: "South America" },
  { name: "Belo Horizonte", country: "BR", continent: "South America" },
  { name: "Porto Alegre", country: "BR", continent: "South America" },
  { name: "Montevideo", country: "UY", continent: "South America" },
  { name: "Quito", country: "EC", continent: "South America" },
  { name: "Guayaquil", country: "EC", continent: "South America" },
  { name: "Medellín", country: "CO", continent: "South America" },
  // Oceania
  { name: "Sydney", country: "AU", continent: "Oceania" },
  { name: "Melbourne", country: "AU", continent: "Oceania" },
  { name: "Auckland", country: "NZ", continent: "Oceania" },
  { name: "Brisbane", country: "AU", continent: "Oceania" },
  { name: "Perth", country: "AU", continent: "Oceania" },
  { name: "Wellington", country: "NZ", continent: "Oceania" },
  { name: "Adelaide", country: "AU", continent: "Oceania" },
  { name: "Canberra", country: "AU", continent: "Oceania" },
  { name: "Christchurch", country: "NZ", continent: "Oceania" },
  { name: "Gold Coast", country: "AU", continent: "Oceania" },
  { name: "Hobart", country: "AU", continent: "Oceania" },
];

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('All');
  const [continent, setContinent] = useState('All');
  const [sliderMin, setSliderMin] = useState(null);
  const [sliderMax, setSliderMax] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_WEATHERBIT_API_KEY;
        const responses = await Promise.all(
          TOP_CITIES.map(cityObj =>
            fetch(`https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(cityObj.name)}&country=${cityObj.country}&key=${apiKey}`)
          )
        );
        const data = await Promise.all(responses.map(res => res.json()));
        const allData = data.map(d => d.data && d.data[0] ? d.data[0] : null).filter(Boolean);
        setWeatherData(allData);
        // Set slider min/max based on data
        if (allData.length > 0) {
          const temps = allData.map(item => item.temp);
          setSliderMin(Math.floor(Math.min(...temps)));
          setSliderMax(Math.ceil(Math.max(...temps)));
        }
      } catch (err) {
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // Filtered data by search, condition, temperature bounds, and continent
  const filteredData = weatherData.filter(item => {
    const matchesSearch = item.city_name.toLowerCase().includes(search.toLowerCase());
    const matchesCondition = condition === 'All' || item.weather.description === condition;
    const temp = item.temp;
    const matchesMin = sliderMin === null || temp >= sliderMin;
    const matchesMax = sliderMax === null || temp <= sliderMax;
    const matchesContinent = continent === 'All' || (TOP_CITIES.find(c => c.name === item.city_name && c.country === item.country_code)?.continent === continent);
    return matchesSearch && matchesCondition && matchesMin && matchesMax && matchesContinent;
  });

  // Unique weather conditions for filter dropdown
  const uniqueConditions = ['All', ...Array.from(new Set(weatherData.map(item => item.weather.description)))];
  // Unique continent options for filter dropdown
  const uniqueContinents = ['All', ...Array.from(new Set(TOP_CITIES.map(item => item.continent)))];

  // Summary statistics
  const totalCities = filteredData.length;
  const temps = filteredData.map(item => item.temp);
  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '-';
  const minTempDisplay = temps.length ? Math.min(...temps).toFixed(1) : '-';
  const maxTempDisplay = temps.length ? Math.max(...temps).toFixed(1) : '-';

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label htmlFor="weather-select" style={{ marginLeft: '8px' }}>Weather:</label>
        <select id="weather-select" value={condition} onChange={e => setCondition(e.target.value)}>
          {uniqueConditions.map(cond => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>
        <label htmlFor="continent-select" style={{ marginLeft: '8px' }}>Continent:</label>
        <select id="continent-select" value={continent} onChange={e => setContinent(e.target.value)}>
          {uniqueContinents.map(cont => (
            <option key={cont} value={cont}>{cont}</option>
          ))}
        </select>
        {sliderMin !== null && sliderMax !== null && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
            <label htmlFor="min-temp-slider" style={{ marginRight: '4px' }}>Min Temp:</label>
            <input
              id="min-temp-slider"
              type="range"
              min={Math.floor(Math.min(...weatherData.map(item => item.temp)))}
              max={sliderMax}
              value={sliderMin}
              onChange={e => setSliderMin(Number(e.target.value))}
              style={{ marginRight: '8px' }}
            />
            <span style={{ minWidth: '32px', textAlign: 'right' }}>{sliderMin}°C</span>
            <label htmlFor="max-temp-slider" style={{ margin: '0 8px 0 16px' }}>Max Temp:</label>
            <input
              id="max-temp-slider"
              type="range"
              min={sliderMin}
              max={Math.ceil(Math.max(...weatherData.map(item => item.temp)))}
              value={sliderMax}
              onChange={e => setSliderMax(Number(e.target.value))}
              style={{ marginRight: '8px' }}
            />
            <span style={{ minWidth: '32px', textAlign: 'right' }}>{sliderMax}°C</span>
          </div>
        )}
      </div>
      <div className="dashboard-summary">
        <p>Total Cities: {totalCities}</p>
        <p>Average Temp: {avgTemp}°C</p>
        <p>Min Temp: {minTempDisplay}°C</p>
        <p>Max Temp: {maxTempDisplay}°C</p>
      </div>
      {loading ? (
        <p>Loading weather data...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Temperature (°C)</th>
              <th>Condition</th>
              <th>Icon</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.city_name}>
                <td>{item.city_name}</td>
                <td>{item.temp}</td>
                <td>{item.weather.description}</td>
                <td>
                  <img
                    src={`https://www.weatherbit.io/static/img/icons/${item.weather.icon}.png`}
                    alt={item.weather.description}
                    width={32}
                    height={32}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
