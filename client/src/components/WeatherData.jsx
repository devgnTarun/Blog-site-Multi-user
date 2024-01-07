import React, { useState, useEffect } from 'react';
import iconSvg from './icon.svg'

const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = "http://api.weatherstack.com/current";
        const accessKey = "1a490b0efb64b1f340087f6f5e132c5e";
        const query = "India";

        const apiEndpoint = `${apiUrl}?access_key=${accessKey}&query=${query}`;

        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data.current);
            })
            .catch(error => {
                setError(error.message || 'Error fetching weather data');
            });
    }, []);

    return (
        <div className="flex items-center space-x-2">
            {error && <p className="text-red-500">{error}</p>}
            {weatherData && (
                <div className="flex items-center">
                    <img
                        src={iconSvg}
                        alt="Weather Icon"
                        className="w-9 h-9"
                    />
                    <p className="text-sm">{weatherData.temperature}°C</p>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;
