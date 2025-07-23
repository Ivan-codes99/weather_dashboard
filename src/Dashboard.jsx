import { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import TOP_CITIES from './topCities';
import MOCK_WEATHER_DATA from './mockWeatherData'; // ✅ import your mock data
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

function Dashboard({ onCitySelect }) {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('All');
  const [continent, setContinent] = useState('All');
  const [sliderMin, setSliderMin] = useState(null);
  const [sliderMax, setSliderMax] = useState(null);

  useEffect(() => {
    try {
      // Simulate async loading (optional)
      const loadData = async () => {
        setLoading(true);
        const data = MOCK_WEATHER_DATA;
        setWeatherData(data);

        if (data.length > 0) {
          const temps = data.map(item => item.temp);
          setSliderMin(Math.floor(Math.min(...temps)));
          setSliderMax(Math.ceil(Math.max(...temps)));
        }

        setLoading(false);
      };

      loadData();
    } catch (err) {
      setError("Failed to load mock weather data.");
      setLoading(false);
    }
  }, []);


  const filteredData = weatherData.filter(item => {
    const matchesSearch = item.city_name.toLowerCase().includes(search.toLowerCase());
    const matchesCondition = condition === 'All' || item.weather.description === condition;
    const temp = item.temp;
    const matchesMin = sliderMin === null || temp >= sliderMin;
    const matchesMax = sliderMax === null || temp <= sliderMax;
    const matchesContinent = continent === 'All' || (TOP_CITIES.find(c => c.name === item.city_name && c.country === item.country_code)?.continent === continent);
    return matchesSearch && matchesCondition && matchesMin && matchesMax && matchesContinent;
  });

  const uniqueConditions = ['All', ...Array.from(new Set(weatherData.map(item => item.weather.description)))];
  const uniqueContinents = ['All', ...Array.from(new Set(TOP_CITIES.map(item => item.continent)))];

  const totalCities = filteredData.length;
  const temps = filteredData.map(item => item.temp);
  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '-';
  const minTempDisplay = temps.length ? Math.min(...temps).toFixed(1) : '-';
  const maxTempDisplay = temps.length ? Math.max(...temps).toFixed(1) : '-';

  // --- Chart Data Preparation ---
  // 1. Average temperature by continent
  const continentTemps = {};
  filteredData.forEach(item => {
    const cityObj = TOP_CITIES.find(c => c.name === item.city_name && c.country === item.country_code);
    if (!cityObj) return;
    const cont = cityObj.continent;
    if (!continentTemps[cont]) continentTemps[cont] = [];
    continentTemps[cont].push(item.temp);
  });
  const avgTempByContinent = Object.entries(continentTemps).map(([continent, temps]) => ({
    continent,
    avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
  }));

  // 2. Weather condition distribution
  const conditionCounts = {};
  filteredData.forEach(item => {
    const cond = item.weather.description;
    conditionCounts[cond] = (conditionCounts[cond] || 0) + 1;
  });
  const conditionData = Object.entries(conditionCounts).map(([condition, count]) => ({
    name: condition,
    value: count
  }));

  const pieColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#d8854f', '#888888', '#b8860b', '#4682b4', '#e06666'
  ];

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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: 2 }}>
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
                    <td>
                      <Link to={`/details/${encodeURIComponent(item.city_name)}`}>
                        {item.city_name}
                      </Link>
                    </td>
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
        <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#23272f', borderRadius: 12, padding: 16, color: '#fff' }}>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>Avg Temp by Continent</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={avgTempByContinent}>
                <XAxis dataKey="continent" stroke="#fff" tick={{ fill: '#fff' }} />
                <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                <Tooltip contentStyle={{ background: '#23272f', color: '#fff', border: 'none' }} />
                <Bar dataKey="avgTemp" fill="#40a9ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: '#23272f', borderRadius: 12, padding: 16, color: '#fff' }}>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>Weather Condition Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={conditionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={70}
                  fill="#8884d8"
                  label={{ fill: '#fff' }}
                >
                  {conditionData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ color: '#fff', marginTop: 24 }} />
                <Tooltip
                  contentStyle={{ background: '#23272f', color: '#fff', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 