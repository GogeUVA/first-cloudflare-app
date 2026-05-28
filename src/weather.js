/**
 * weather.js
 * Functions for interacting with weather.gov API
 */

export async function getWeather(city, state) {

  // Step 1:
  // Convert city/state into latitude + longitude
  // Using Nominatim OpenStreetMap geocoding API
  const geoUrl =
    `https://nominatim.openstreetmap.org/search?` +
    `city=${encodeURIComponent(city)}` +
    `&state=${encodeURIComponent(state)}` +
    `&country=USA&format=json&limit=1`;

  const geoResponse = await fetch(geoUrl, {
    headers: {
      'User-Agent': 'discord-weather-bot',
    },
  });

  const geoData = await geoResponse.json();

  if (!geoData.length) {
    throw new Error('Location not found.');
  }

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;

  // Step 2:
  // Get weather.gov grid endpoint
  const pointResponse = await fetch(
    `https://api.weather.gov/points/${lat},${lon}`,
    {
      headers: {
        'User-Agent': 'discord-weather-bot',
        'Accept': 'application/geo+json',
      },
    }
  );

  const pointData = await pointResponse.json();

  const forecastUrl =
    pointData.properties.forecast;

  // Step 3:
  // Get forecast
  const forecastResponse = await fetch(
    forecastUrl,
    {
      headers: {
        'User-Agent': 'discord-weather-bot',
        'Accept': 'application/geo+json',
      },
    }
  );

  const forecastData = await forecastResponse.json();

  const current =
    forecastData.properties.periods[0];

  return {
    city,
    state,
    temperature: current.temperature,
    unit: current.temperatureUnit,
    wind: `${current.windSpeed} ${current.windDirection}`,
    forecast: current.shortForecast,
  };
}