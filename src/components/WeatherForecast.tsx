// src/components/WeatherForecast.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Spinner } from 'react-bootstrap';

interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: string;
}

const WeatherForecast: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);

        // Step 1: Get city coordinates
        const coordResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const coordData = await coordResponse.json();
        const { latitude, longitude } = coordData.results[0];

        // Step 2: Fetch forecast data based on coordinates
        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=GMT`
        );
        const forecastData = await forecastResponse.json();

        // Step 3: Process the forecast data
        const days = forecastData.daily.time.map((date: string, index: number) => ({
          date,
          temp_min: forecastData.daily.temperature_2m_min[index],
          temp_max: forecastData.daily.temperature_2m_max[index],
          weather: translateWeatherCode(forecastData.daily.weathercode[index]),
        }));
        setForecast(days);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city]);

  // Helper function to translate weather code
  const translateWeatherCode = (code: number) => {
    const weatherInterpretation: { [key: number]: string } = {
      0: "Clear Sky",
      1: "Mostly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Dense Fog",
      51: "Drizzle: Light",
      53: "Drizzle: Moderate",
      55: "Drizzle: Heavy",
      56: "Freezing Drizzle: Light",
      57: "Freezing Drizzle: Heavy",
      61: "Rain: Light",
      63: "Rain: Moderate",
      65: "Rain: Heavy",
      66: "Freezing Rain: Light",
      67: "Freezing Rain: Heavy",
      71: "Snow: Light",
      73: "Snow: Moderate",
      75: "Snow: Heavy",
      77: "Snow Grains",
      80: "Showers: Light",
      81: "Showers: Moderate",
      82: "Showers: Heavy",
      85: "Snow Showers: Light",
      86: "Snow Showers: Heavy",
      95: "Thunderstorm: Slight or Moderate",
      96: "Thunderstorm with Hail: Small",
      99: "Thunderstorm with Hail: Large",
    };
    return weatherInterpretation[code] || "Unknown";
  };

  return (
    <div>
      <h2>7-Day Weather Forecast for {city}</h2>
      <Link to="/" className="btn btn-secondary mb-3">Back to Main</Link>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Min Temp (°C)</th>
              <th>Max Temp (°C)</th>
              <th>Weather</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((day) => (
              <tr key={day.date}>
                <td>{day.date}</td>
                <td>{day.temp_min}°C</td>
                <td>{day.temp_max}°C</td>
                <td>{day.weather}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default WeatherForecast;

