import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface CityCardProps {
  city: string;
}

interface WeatherData {
  temperature: number;
  weather: string;
  windSpeed: number;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        const coordResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const coordData = await coordResponse.json();
        const { latitude, longitude } = coordData.results[0];

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&windspeed_unit=ms`
        );
        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current_weather;

        setWeatherData({
          temperature: currentWeather.temperature,
          weather: translateWeatherCode(currentWeather.weathercode),
          windSpeed: currentWeather.windspeed,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

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
    <Card style={{ width: '20rem' }}>
      <Card.Body>
        <Card.Title>{city}</Card.Title>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <Card.Text>Temperature: {weatherData?.temperature}°C</Card.Text>
            <Card.Text>Weather: {weatherData?.weather}</Card.Text>
            <Card.Text>Wind Speed: {weatherData?.windSpeed} m/s</Card.Text>
          </>
        )}
        {loading ? (
            <span>Loading...</span>
        ) : (
            <>
                <Link to={`/weather/${city}`} className="btn btn-primary"> View Forecast </Link>
            </>
        )}
      </Card.Body>
    </Card>
  );
};

export default CityCard;


