let weatherDataDict = {};
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
            
            // Update the page with the weather data
            temperature = data.temperature;
            wind = data.wind;
            uv = data.uv;
            condition = data.condition;
            conditionLater = data.conditionLater;
            weatherDataDict = data;

            // After retrieving weather data, update index
            const runScore = run_index(weatherDataDict);
            const cycleScore = cycling_index(weatherDataDict);
            const swimScore = swim_index(weatherDataDict);
            document.getElementById("result").textContent = runScore;

            console.log("record: " +[runScore,cycleScore,swimScore]);
            //Colourise pills based off smart index score
            updatePillColor("run-pill", runScore);
            updatePillColor("cycle-pill", cycleScore);
            updatePillColor("swim-pill", swimScore);
            
            // after index is updated activate the smart index script.
            const event = new CustomEvent("WeatherDataUpdated",{ detail: {result: result}});
            document.dispatchEvent(event)

            // prepare data to tiles.js
            const eventTiles = new CustomEvent("WeatherDataUpdatedTiles",{ detail: { temperature, wind, uv, condition, conditionLater, result }});
            document.dispatchEvent(eventTiles)
            
            console.log("Fetched Data2:", weatherDataDict);
})};

function updatePillColor(elementId, score) {
    const pill = document.getElementById(elementId);
    if (!pill) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }
    if (score >= 70) {
        pill.style.backgroundColor = "#4CAF50"; // Green
    } else if (score >= 40) {
        pill.style.backgroundColor = "#FFC107"; // Amber
    } else if (score >= 0) {
        pill.style.backgroundColor = "#F44336"; // Red
    } else {
        pill.style.backgroundColor = "#9E9E9E"; // Grey
    }
}

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

function calc_range_scores(value, range, idealScore) {
    let calc_score = 0;
    // Given an upper and lower limit set in variable 'range', calculate score. Out of range is negative score, within range equals 'idealScore'.
    if (value < range[0]) {
        calc_score += (value - range[0])
    } else if (value > range[1]) {
        calc_score -= (value - range[1])
    } else {
        calc_score = idealScore;
    }
    return calc_score;
}

function calc_index_score(weatherData, temperatureRange, temperatureDangerRange, windRange, windDangerLimit, uvRange) {
    
    // declare empty scores for calculating final index
    let temp_score = 0;
    let wind_score = 0;
    let uv_score = 0;
    let condition_score = 0;

    // calc temperature score
    calc_range_scores(weatherData.temperature, temperatureRange, 30);

    // calc wind score
    calc_range_scores(weatherData.wind, temperatureRange, 30);

    // calc uv score. If uv is higher than upper range return negative score. If UV is within recomended range return positive score.
    if (uvRange[1] < weatherData.uv) {
        uv_score = - 20;
    } else {
        uv_score = 20;
    }

    // calc condition score
    condition_score = favourable_condition_score(weatherData.condition);

    let index = temp_score + wind_score + uv_score + condition_score;

    // danger zones return 0 score
    // if temperature is greater than danger limit
    if (weatherData.temperature < temperatureDangerRange[0]) {
        index = 0;
    } else if (weatherData.temperature > temperatureDangerRange[1]) {
        index = 0;
    }
    // if wind is greater than danger limit
    if (weatherData.wind > windDangerLimit) {
        index = 0;
    }

    console.log("condtion_score: " + condition_score);
    console.log("temp_score: " + temp_score);
    console.log("wind_score: " + wind_score);
    console.log("uv_score: " + uv_score);

    console.log("index: " + index);

    // apply upper limit of 100 and lower limit of 0. Round to nearest whole number. return value.
    return Math.round(Math.min(100,Math.max(0,index)));
}

    // Functions to calculate all the different sport index's 

// calculate the run_index score
function run_index(weatherDataDict) {
    const temp_range = [10,25]; // optimum temperature range
    const danger_temp_range = [-10, 50]; // min and max temps before score is set to 0
    const wind_range = [0, 30]; // optimum wind range
    const danger_wind_limit = 50; // max and min temps before score is set to 0
    const uv_range = [0, 7]; // optimum UV Range

    // calculate running Index
    let runIndex = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("run Index: " + runIndex);
    return runIndex;
}

// calculate the Cycling_index score
function cycling_index(weatherDataDict) {
    const temp_range = [10,25]; // optimum temperature range
    const danger_temp_range = [0, 50]; // max and min temps before score is set to 0
    const wind_range = [0, 20]; // optimum wind range
    const danger_wind_limit = 40; // max and min temps before score is set to 0
    const uv_range = [0, 7]; // optimum UV Range

    // calculate cycling Index
    let cycleIndex = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("cycle Index: " + cycleIndex);
    return cycleIndex;
}

// calculate the swimming_index score
function swim_index(weatherDataDict) {
    const temp_range = [20,35]; // optimum temperature range
    const danger_temp_range = [10, 60]; // max and min temps before score is set to 0
    const wind_range = [0, 40]; // optimum wind range
    const danger_wind_limit = 60; // max and min temps before score is set to 0
    const uv_range = [0, 5]; // optimum UV Range

    // calculate cycling Index
    let swimIndex = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("swim Index: " + swimIndex);
    return swimIndex;
}

// update the fields in HTML with the results
document.addEventListener("DOMContentLoaded", function() {
    fetchWeatherData();
});