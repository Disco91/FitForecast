let temperature = -99;
let wind = -99;
let uv = -99;

// using python random function return random weather data
function fetchWeatherData() {
    fetch('/weather/')
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Update the page with the weather data
            temperature = data.temperature;
            wind = data.wind;
            uv = data.uv;

            // After retrieving weather data, update index
            const result = walk_index(temperature, wind, uv);
            document.getElementById("result").textContent = result;
            
            // after index is updated activate the smart index script.
            const event = new CustomEvent("WeatherDataUpdated",{ detail: {result: result}});
            document.dispatchEvent(event)
})};

// function to linearly score the value from 0 - 1
function normalize(value, range) {
    const [min, max] = range;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// Function to calculate temperature score with penalty for out-of-range values
function temperature_score(value, range) {
    const [min, max] = range;
    const mid = (min + max) / 2; // Ideal middle point

    if (value < min) {
        return normalize(value, [min - 10, min]); // Penalize lower temps
    } else if (value > max) {
        return normalize(value, [max, max + 10]); // Penalize higher temps
    } else {
        return 1 - Math.abs((value - mid) / (max - min) * 2); // Best score at mid, decreases outward
    }
}

// calculate the walk_index score
function walk_index(temperature, wind, uv) {
    const temp_range = [10,25];
    const wind_range = [0, 30];
    const uv_range = [0, 8];

    if (temperature == -99 || wind == -99 || uv == -99) {
        return "No Data"
    }

    let temp_score = temperature_score(temperature, temp_range); //
    let wind_score = 1 - normalize(wind, wind_range); // Less wind is better
    let uv_score = 1 - normalize(uv, uv_range);       // Lower UV is better
    
    let index = ((temp_score + wind_score + uv_score) / 3) * 100;

    return Math.round(index);
}

// update the fields in HTML with the results
document.addEventListener("DOMContentLoaded", function() {
    fetchWeatherData();
});