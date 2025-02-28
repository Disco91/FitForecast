require('dotenv').config();
const axios = require('axios');

// Store the time of the last request
let lastRequestTime = 0;
const rateLimitInMinutes = 1; // 1 minute limit

// Your weather API base URL
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

// Function to fetch weather data with rate limiting
async function getWeather(city) {
    const currentTime = Date.now(); // Get the current time in milliseconds

    // Check if one minute has passed since the last request
    if (currentTime - lastRequestTime < rateLimitInMinutes * 60 * 1000) {
        console.log("You can only make one request per minute. Please wait.");
        return; // Exit the function if the user is within the rate limit
    }

    const apiKey = process.env.API_KEY; // Get the API key from .env
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url); // Make the GET request
        const data = response.data;

        // Update the last request time to the current time
        lastRequestTime = currentTime;

        // Print the weather data
        console.log(`Weather in ${city}:`);
        console.log(`Temperature: ${data.main.temp}°C`);
        console.log(`Weather: ${data.weather[0].description}`);
        console.log(`Humidity: ${data.main.humidity}%`);
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
    }
}

// Call the function with a city name
getWeather('London');  // You can change 'London' to any city
