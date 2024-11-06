import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AutocompleteInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
        const data = await response.json();
        setSuggestions(data.results.map((result: any) => result.name + ', ' + result.country));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };


    const debounceFetch = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceFetch);
  }, [query]);


  const handleSelect = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    navigate(`/weather/${city}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Form.Control
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <Spinner animation="border" role="status" className="mt-2" />}

      {suggestions.length > 0 && (
        <ListGroup style={{ position: 'absolute', top: '100%', width: '100%', zIndex: 1000 }}>
          {suggestions.map((city, index) => (
            <ListGroup.Item key={index} action onClick={() => handleSelect(city)}>
              {city}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default AutocompleteInput;