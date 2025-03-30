let weatherDataDict = {};
let temperature = -99;
let wind = -99;
let uv = -99;
let condition = "sunny";
let conditionLater = "sunny";

// default scores created
let runScore = -99;
let cycleScore = -99;
let swimScore = -99;
let yogaScore = -99;
let gymScore = -99;
let surfScore = -99;
let supScore = -99;
let dragonboatScore = -99;

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
            runScore = run_index(weatherDataDict);
            cycleScore = cycling_index(weatherDataDict);
            swimScore = swim_index(weatherDataDict);
            yogaScore = yoga_index(weatherDataDict);
            gymScore = gym_index(weatherDataDict);
            surfScore = surf_index(weatherDataDict);
            supScore = sup_index(weatherDataDict);
            dragonboatScore = dragonboat_index(weatherDataDict);

            // default to first item which is running, *improvement would be to return first pill regardless.
            document.getElementById("result").textContent = runScore;
            document.getElementById("result_text").textContent = returnMessage(runScore);

            //Colourise pills based off smart index score
            updatePillColor("run-pill", runScore);
            updatePillColor("cycle-pill", cycleScore);
            updatePillColor("swim-pill", swimScore);
            updatePillColor("yoga-pill", yogaScore);
            updatePillColor("gym-pill", gymScore);
            updatePillColor("surf-pill", surfScore);
            updatePillColor("sup-pill", supScore);
            updatePillColor("dragonboat-pill", dragonboatScore);
            
            // after index is updated activate the smart index script.
            const event = new CustomEvent("WeatherDataUpdated",{ detail: {result: result}});
            document.dispatchEvent(event)

            // prepare data to tiles.js
            const eventTiles = new CustomEvent("WeatherDataUpdatedTiles",{ detail: { temperature, wind, uv, condition, conditionLater, result }});
            document.dispatchEvent(eventTiles)
            
            console.log("Fetched Data2:", weatherDataDict);
})};

const sportsPills = document.querySelectorAll('.sport');
    sportsPills.forEach(pill => {
        pill.addEventListener("click", function() {
            // console.log("Pill is: " + pill.id)
            let index = null; 

            // determine what score to use based on selected pill.
            if (pill.id === "run-pill"){
                index = runScore;
            } else if (pill.id === "cycle-pill") {
                index = cycleScore;
            } else if (pill.id === "swim-pill") {
                index = swimScore;
            } else if (pill.id === "yoga-pill") {
                index = yogaScore;
            } else if (pill.id === "gym-pill") {
                index = gymScore;
            } else if (pill.id === "surf-pill") {
                index = surfScore;
            } else if (pill.id === "sup-pill") {
                index = supScore;
            } else if (pill.id === "dragonboat-pill") {
                index = dragonboatScore;
            }

            document.getElementById("result").textContent = index;
            document.getElementById("result_text").textContent = returnMessage(index);

            const event = new CustomEvent("WeatherDataUpdated",{ detail: {result: result}});
            document.dispatchEvent(event)

        })
    });

function returnMessage(score) {
    if (score == 0) {
        return "Not recommended!";
    } else if (score <= 25) {
        return "Not ideal conditions today";
    } else if (score <= 40) {
        return "Not ideal conditions today";
    } else if (score <= 60) {
        return "Worth a try!";
    } else if (score < 100) {
        return "Great Conditions!";
    } else if (score == 100) {
        return "Does not get better!";
    } else {
        return "";
    }
}

function updatePillColor(elementId, score) {
    const pill = document.getElementById(elementId);
    if (!pill) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }
    console.log("pillid: " + pill.id + " - " + score)
    if (score <= 25) {
        pill.style.backgroundColor =  "red";
    } else if (score <= 40) {
        pill.style.backgroundColor =  "orange";
    } else if (score <= 60) {
        pill.style.backgroundColor =  "yellow";
    } else if (score <= 80) {
        pill.style.backgroundColor =  "#32CD32"; // lime green
    } else {
        pill.style.backgroundColor =  "green";
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
        sunny: 30,
        cloud: 30,
        rainy: -10,
        thunderstorm: -50,
        partly_cloudy_day: 50,
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
    temp_score = calc_range_scores(weatherData.temperature, temperatureRange, 30);

    // calc wind score
    wind_score = calc_range_scores(weatherData.wind, temperatureRange, 30);

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

    //console.log("condtion_score: " + condition_score);
    //console.log("temp_score: " + temp_score);
    //console.log("wind_score: " + wind_score);
    //console.log("uv_score: " + uv_score);

    //console.log("index: " + index);

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

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("run Index: " + index);
    return index;
}

// calculate the Cycling_index score
function cycling_index(weatherDataDict) {
    const temp_range = [5,30]; // optimum temperature range
    const danger_temp_range = [0, 50]; // max and min temps before score is set to 0
    const wind_range = [0, 20]; // optimum wind range
    const danger_wind_limit = 40; // max and min temps before score is set to 0
    const uv_range = [0, 7]; // optimum UV Range

    // calculate Index
    let Index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("cycle Index: " + Index);
    return Index;
}

// calculate the swimming_index score
function swim_index(weatherDataDict) {
    const temp_range = [20,35]; // optimum temperature range
    const danger_temp_range = [10, 60]; // max and min temps before score is set to 0
    const wind_range = [0, 40]; // optimum wind range
    const danger_wind_limit = 60; // max and min temps before score is set to 0
    const uv_range = [0, 5]; // optimum UV Range

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("swim Index: " + index);
    return index;
}

// calculate the yoga_index score
function yoga_index(weatherDataDict) {
    const temp_range = [-999,999]; // optimum temperature range
    const danger_temp_range = [-999, 999]; // max and min temps before score is set to 0
    const wind_range = [-999, 999]; // optimum wind range
    const danger_wind_limit = 999; // max and min temps before score is set to 0
    const uv_range = [0, 99]; // optimum UV Range

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("yoga Index: " + index);
    return index;
}

// calculate the swimming_index score
function gym_index(weatherDataDict) {
    const temp_range = [-999,999]; // optimum temperature range
    const danger_temp_range = [-999, 999]; // max and min temps before score is set to 0
    const wind_range = [-999, 999]; // optimum wind range
    const danger_wind_limit = 999; // max and min temps before score is set to 0
    const uv_range = [0, 99]; // optimum UV Range

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("gym Index: " + index);
    return index;
}

// calculate the swimming_index score
function surf_index(weatherDataDict) {
    const temp_range = [15,40]; // optimum temperature range
    const danger_temp_range = [5, 60]; // max and min temps before score is set to 0
    const wind_range = [0, 20]; // optimum wind range
    const danger_wind_limit = 60; // max and min temps before score is set to 0
    const uv_range = [0, 5]; // optimum UV Range

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("surf Index: " + index);
    return index;
}

// calculate the swimming_index score
function sup_index(weatherDataDict) {
    const temp_range = [20,40]; // optimum temperature range
    const danger_temp_range = [5, 60]; // max and min temps before score is set to 0
    const wind_range = [0, 10]; // optimum wind range
    const danger_wind_limit = 30; // max and min temps before score is set to 0
    const uv_range = [0, 5]; // optimum UV Range

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("sup Index: " + index);
    return index;
}

// calculate the dragonboat_index score
function dragonboat_index(weatherDataDict) {
    const temp_range = [5,35]; // optimum temperature range
    const danger_temp_range = [-5, 60]; // max and min temps before score is set to 0
    const wind_range = [0, 30]; // optimum wind range
    const danger_wind_limit = 50; // max and min temps before score is set to 0
    const uv_range = [0, 7]; // optimum UV Range

    // calculate Index
    let index = calc_index_score(weatherDataDict, temp_range, danger_temp_range,
         wind_range, danger_wind_limit, uv_range);

    console.log("dragonboat Index: " + index);
    return index;
}

// update the fields in HTML with the results
document.addEventListener("DOMContentLoaded", function() {
    fetchWeatherData();
});