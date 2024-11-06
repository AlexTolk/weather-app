import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import AutocompleteInput from './components/AutocompleteInput';
import CityCard from './components/CityCard';
import WeatherForecast from './components/WeatherForecast';

interface City {
  name: string;
}

const cities: City[] = [
  { name: 'Moscow' },
  { name: 'St Petersburg' },
  { name: 'Rostov-on-Don' },
  { name: 'Vladivostok' },
  { name: 'Krasnodar' },
  { name: 'Yekaterinburg' },
];

const App: React.FC = () => {
  return (
    <Router>
      <Container className="my-4">
        <Row className='mb-5'>
          <h1>Weather Dashboard</h1>
          <AutocompleteInput />
        </Row>
        <Routes>
          <Route
            path="/"
            element={
              <Row>
                {cities.map((city) => (
                  <Col key={city.name} xs={12} sm={6} md={4} className="mb-4">
                    <CityCard city={city.name} />
                  </Col>
                ))}
              </Row>
            }
          />

          <Route path="/weather/:city" element={<WeatherForecast />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
