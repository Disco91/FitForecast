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
            runScore = calculate_activity_index("run", weatherDataDict);
            cycleScore = calculate_activity_index("cycle", weatherDataDict);
            swimScore = calculate_activity_index("swim", weatherDataDict);
            yogaScore = calculate_activity_index("yoga", weatherDataDict);
            gymScore = calculate_activity_index("gym", weatherDataDict);
            surfScore = calculate_activity_index("surf", weatherDataDict);
            supScore = calculate_activity_index("sup", weatherDataDict);
            dragonboatScore = calculate_activity_index("dragonboat", weatherDataDict);

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
            
            console.log("Fetched Data:", weatherDataDict);
})};

// collect all sports pills in sports bar
const sportsPills = document.querySelectorAll('.sport');

// check for when a sport pill is selected and update smart index container
sportsPills.forEach(pill => {
    pill.addEventListener("click", function() {
        
        // Store score relationships with pills
        const scores = {
            "run-pill": runScore,
            "cycle-pill": cycleScore,
            "swim-pill": swimScore,
            "yoga-pill": yogaScore,
            "gym-pill": gymScore,
            "surf-pill": surfScore,
            "sup-pill": supScore,
            "dragonboat-pill": dragonboatScore
};
        // set active sport smart index based on current sport pill selected
        let index = scores[pill.id]; 

        // push smart index to smart gauge
        document.getElementById("result").textContent = index;
        // push condition message to smart gauge
        document.getElementById("result_text").textContent = returnMessage(index);

        // Activate a weatherdataupdated event to animate the smart index and update the tiles after selecting new pill.
        const event = new CustomEvent("WeatherDataUpdated",{ detail: {result: result}});
        document.dispatchEvent(event)

    })
});

// Return smart index messsage based on score
function returnMessage(score) {
    if (score === 0) {
        return "Not recommended!";
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

// Update the sports pill background color based on its score
function updatePillColor(elementId, score) {
    const pill = document.getElementById(elementId);
    // check pill is found
    if (!pill) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }
    // console.log("pillid: " + pill.id + " - " + score)

    // change pill background colors based on index
    if (score <= 25) {
        pill.style.backgroundColor =  "red";
    } else if (score <= 40) {
        pill.style.backgroundColor =  "#e67e22";
    } else if (score <= 60) {
        pill.style.backgroundColor =  "#FFBF00";
    } else if (score <= 80) {
        pill.style.backgroundColor =  "#32CD32"; // lime green
    } else {
        pill.style.backgroundColor =  "green";
    }
}

// Return score of current weather condition
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

// For calculating scores within ranges, if within range return good score, if outside progressively worse score.
function calculate_range_scores(value, range, idealScore) {
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

// Taking in an activity, calculate the smart index score based on its parameters and the current weather data.
function calculate_activity_index(activity, weatherDataDict) {
    // List of sports and parameters to calculate index
    const activityParams = {
        "run":       { temp: [10, 25], dangerTemp: [-10, 50], wind: [0, 30], dangerWind: 50, uv: [0, 7] },
        "cycle":     { temp: [5, 30], dangerTemp: [0, 50], wind: [0, 20], dangerWind: 40, uv: [0, 7] },
        "swim":      { temp: [20, 35], dangerTemp: [10, 60], wind: [0, 40], dangerWind: 60, uv: [0, 5] },
        "yoga":      { temp: [-999, 999], dangerTemp: [-999, 999], wind: [-999, 999], dangerWind: 999, uv: [0, 99] },
        "gym":       { temp: [-999, 999], dangerTemp: [-999, 999], wind: [-999, 999], dangerWind: 999, uv: [0, 99] },
        "surf":      { temp: [15, 40], dangerTemp: [5, 60], wind: [0, 20], dangerWind: 60, uv: [0, 5] },
        "sup":       { temp: [20, 40], dangerTemp: [5, 60], wind: [0, 10], dangerWind: 30, uv: [0, 5] },
        "dragonboat": { temp: [5, 35], dangerTemp: [-5, 60], wind: [0, 30], dangerWind: 50, uv: [0, 7] }
    };

    const params = activityParams[activity];

    // Calculate index using shared function
    let index = calculate_index_score(weatherDataDict, params.temp, params.dangerTemp, params.wind, params.dangerWind, params.uv);

    console.log(`${activity} Index: ${index}`);
    return index;
}

// Taking in the activity parameters calculate smart index score.
function calculate_index_score(weatherData, temperatureRange, temperatureDangerRange, windRange, windDangerLimit, uvRange) {
    
    // declare empty scores for calculating final index
    let temp_score = 0;
    let wind_score = 0;
    let uv_score = 0;
    let condition_score = 0;

    // calc temperature score
    temp_score = calculate_range_scores(weatherData.temperature, temperatureRange, 30);

    // calc wind score
    wind_score = calculate_range_scores(weatherData.wind, windRange, 30);

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

    // apply upper limit of 100 and lower limit of 0. Round to nearest whole number. return value.
    return Math.round(Math.min(100,Math.max(0,index)));
}

// update the fields in HTML with the results
document.addEventListener("DOMContentLoaded", function() {
    fetchWeatherData();
});