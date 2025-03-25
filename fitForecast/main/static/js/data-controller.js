let temperature = -99;
let wind = -99;
let uv = -99;
let condition = "sunny";
let conditionLater = "sunny";

// using python random function return random weather data
function fetchWeatherData() {
    fetch('/weather/')
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            console.log("Fetched Data:", data);
            // Update the page with the weather data
            temperature = data.temperature;
            wind = data.wind;
            uv = data.uv;
            condition = data.condition;
            conditionLater = data.conditionLater;

            // After retrieving weather data, update index
            const result = run_index(temperature, wind, uv, condition, conditionLater);
            document.getElementById("result").textContent = result;
            
            // after index is updated activate the smart index script.
            const event = new CustomEvent("WeatherDataUpdated",{ detail: {result: result}});
            document.dispatchEvent(event)

            // prepare data to tiles.js
            const eventTiles = new CustomEvent("WeatherDataUpdatedTiles",{ detail: { temperature, wind, uv, condition, conditionLater, result }});
            document.dispatchEvent(eventTiles)
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

function favourable_condition_score(condition) {
    conditons = ["sunny", "cloud", "rainy", "partly_cloudy_day", "thunderstorm"];

    const scores = {
        sunny: 20,
        cloud: 20,
        rainy: -20,
        thunderstorm: -50,
        partly_cloudy_day: 20,
    };

    return scores[condition] ?? 0; // Return 0 if condition is not in scores
}

// calculate the run_index score
function run_index(temperature, wind, uv, condition) {
    const temp_range = [10,25]; // optimum temperature range
    const danger_temp_range = [-10, 50]; // max and min temps before score is set to 0
    const wind_range = [0, 30]; // optimum wind range
    const danger_wind_limit = 50; // max and min temps before score is set to 0
    const uv_range = [0, 5]; // optimum UV Range

    if (temperature == -99 || wind == -99 || uv == -99) {
        return "No Data"
    }

    let temp_score = 0;
    // if temp range 
    if (temperature < temp_range[0]) {
        temp_score += (temperature - temp_range[0])
    } else if (temperature > temp_range[1]) {
        temp_score -= (temperature - temp_range[1])
    } else {
        temp_score = 30; // ideal temp range
    }

    let wind_score = 1 - normalize(wind, wind_range)*10; // Less wind is better
    
    let uv_score = 1 - normalize(uv, uv_range);       // Lower UV is better
    uv_score -= (uv - 5 * 2); // every uv above 5 lowers score by 2* per UV.

    let condtion_score = favourable_condition_score(condition); // return condition score

    console.log("condtion_score: " + condtion_score);
    console.log("temp_score: " + temp_score);
    console.log("wind_score: " + wind_score);
    console.log("uv_score: " + uv_score);

    let index = temp_score + wind_score + uv_score + condtion_score;

    console.log("index: " + index);
    //if (index < 0) {
    //    index = 0;
    //} else if (index > 100) {
    //    index = 100;
    //}

    return Math.round(Math.min(100,Math.max(0,index)));
}

// update the fields in HTML with the results
document.addEventListener("DOMContentLoaded", function() {
    fetchWeatherData();
});