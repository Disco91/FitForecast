document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("tileContainer");
    const addTileBtn = document.getElementById("addTile");

    // Check if elements exist to prevent errors
    if (!container || !addTileBtn) {
        console.error("Tile container or add tile button not found!");
        return;
    }
    
    // create each tile from json data
    function createTile(tileData) {
        console.log("Creating tile:", tileData); 
        const tile = document.createElement("div");
        tile.classList.add("tile");
        
        // Setup Grid
        tile.style.display = "grid";
        tile.style.gridTemplateRows = `repeat(${tileData.rows}, 1fr)`; // Use backticks for template literals
        tile.style.gridTemplateColumns = `repeat(${tileData.cols}, 1fr)`; // Use backticks for template literals
        
        // Fill grid with Tile Data
        tileData.content.forEach(item => {
            let element;
            if (item.type === "text") {
                element = document.createElement("div");
                element.classList.add("text-content");
                element.textContent = item.value;
            } else if (item.type === "headerText") {
                element = document.createElement("h4");
                element.classList.add("text-content");
                element.textContent = item.value;
            } else if (item.type === "image") {
                element = document.createElement("img");
                element.src = item.src;
            } else if (item.type === "chart") {
                element = document.createElement("div");
                element.id = item.id;
                element.style.width = "100%";
                element.style.height = "100%";
            } else if (item.type === "icon") {
                element = document.createElement("div"); // Create an <i> element for the icon
                element.classList.add("material-symbols-outlined", "grid-icon"); // Add the Material Icons class
                element.textContent = item.value; // Set the icon's name (e.g., "home", "star")
            }
            tile.appendChild(element);
            return tile;
        });

        // container.appendChild(tile);

        // SWIPE FUNCTIONALITY (FOR TOUCH AND MOUSE)
        let startX = 0;
        let endX = 0;

        // For phones (touch)
        tile.addEventListener("touchstart", function (e) {
            startX = e.changedTouches[0].screenX;
        });

        tile.addEventListener("touchmove", function (e) {
            endX = e.changedTouches[0].screenX;
        });

        tile.addEventListener("touchend", function () {
            if (endX - startX > 100) { // Swipe right detected
                tile.classList.add("swiped");
                tile.addEventListener('transitionend', function () {
                    tile.remove();
                });
            }
        });

        // For computers (mouse)
        let mouseStartX = 0;
        let mouseEndX = 0;
        let isMouseDown = false;

        tile.addEventListener("mousedown", function (e) {
            isMouseDown = true;
            mouseStartX = e.screenX;
        });

        tile.addEventListener("mousemove", function (e) {
            if (!isMouseDown) return;
            mouseEndX = e.screenX;
        });

        tile.addEventListener("mouseup", function () {
            if (isMouseDown && mouseEndX - mouseStartX > 100) { // Swipe right detected
                tile.classList.add("swiped");
                tile.addEventListener('transitionend', function () {
                    tile.remove();
                });
            }
            isMouseDown = false;
        });

        container.appendChild(tile); // Append the tile to the container
    }

    // ADD TILE BUTTON FUNCTIONALITY
    //addTileBtn.addEventListener("click", function () {
    //    createTile(`Tile ${container.children.length + 1}`);
    //});

    // Example initial tiles
    // createTile("Tile 1");
    // createTile("Tile 2");



    // collect weather data
    let weatherData = {};

    document.addEventListener("WeatherDataUpdatedTiles", function(event) {
        console.log("WeatherDataUpdatedTiles event triggered!");
        weatherData = event.detail;
        console.log("Weather data received:", weatherData); // Log weather data
        // select first pill by default to generate tiles
        sportsPills[0].click();
    });

    function clearTiles() {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    
    const sportsPills = document.querySelectorAll('.sport');
    sportsPills.forEach(pill => {
        pill.addEventListener("click", function() {
            // update selected sport after clicking pill
            const selectedSport = localStorage.getItem("selectedSport"); // collect active sport selected from select-pill.js.

            // When new sport is selected clear tiles
            clearTiles();

            console.log("here is weather data", weatherData);
            // define tile types
            let four_temp_cond_wind_uv = {
                rows: 2,
                cols: 2,
                content: [
                    { type: "text", value: `${weatherData.temperature}°C`},
                    //{ type: "image", src: "/static/images/profile-pic.png" },
                    { type: "icon", value: `${weatherData.condition}` },
                    { type: "text", value: `${weatherData.wind}kph` },
                    { type: "text", value: `UV ${weatherData.uv}` }
                ]
            }

            // conditions now and later
            let condition_now_later = {
                rows: 2,
                cols: 2,
                content: [
                    { type: "headerText", value: 'Now'},
                    { type: "headerText", value: 'Later'},
                    { type: "icon", value: `${weatherData.condition}`},
                    { type: "icon", value: `${weatherData.conditionLater}`}
                ]
            }
            
            // temperature now. High and low temps.
            let temp_now_high_low = {
                rows: 2,
                cols: 3,
                content: [
                    {type: "headerText", value: 'Now'},
                    {type: "headerText", value: 'High'},
                    {type: "headerText", value: 'Low'},
                    {type: "text", value: `${weatherData.temperature}°C`},
                    {type: "text", value: `${weatherData.temperature+5}°C`},
                    {type: "text", value: `${weatherData.temperature/2-6}°C`}
                ]
            }

            // UV Right now and highest uv
            let uv_now_high = {
                rows: 2,
                cols: 3,
                content: [
                    {type: "headerText", value: 'UV'},
                    {type: "headerText", value: 'Now'},
                    {type: "headerText", value: 'High'},
                    {type: "headerText", value: 'Index'},
                    {type: "text", value: `${weatherData.uv}`},
                    {type: "text", value: `${weatherData.uv + 3}`},
                ]
            }
            
            // wind right now, high speed and low speed
            let wind_now_high_low = {
                rows: 2,
                cols: 4,
                content: [
                    {type: "headerText", value: 'Wind'},
                    {type: "headerText", value: 'Now'},
                    {type: "headerText", value: 'High'},
                    {type: "headerText", value: 'Low'},
                    {type: "headerText", value: 'kph'},
                    {type: "text", value: `${weatherData.wind}`},
                    {type: "text", value: `${Math.max(weatherData.wind,weatherData.wind * 2 - 25)}`},
                    {type: "text", value: `${Math.max(0, weatherData.wind - 13)}`}
                ]
            }

            // sunrise and sunset times
            let sunrise_sunset = {
                rows: 2,
                cols: 3,
                content: [
                    {type: "headerText", value: 'Daylight'},
                    {type: "icon", value: 'wb_sunny'},
                    {type: "icon", value: 'wb_twilight'},
                    {type: "headerText", value: 'Hours'},
                    {type: "text", value: '07:32'},
                    {type: "text", value: '20:07'},
                ]
            }

            // define what tiles are shown based on active sport.
            const sportTilePresets = {
                Running: [condition_now_later, temp_now_high_low, uv_now_high, wind_now_high_low],
                Cycling: [condition_now_later, wind_now_high_low],
                Swimming: [condition_now_later, temp_now_high_low, sunrise_sunset]
            }
    
            // collect tiles to render
            activeSportTiles = sportTilePresets[selectedSport];
    
            activeSportTiles.forEach(tile => {
                createTile(tile);
            })
        })
        
        // Load the chart script and render the chart after tiles are created
        const script = document.createElement("script");
        script.src = "/static/js/temp-chart.js";
        script.onload = function() {
            google.charts.setOnLoadCallback(function () {
                drawChart("chart_div"); // Pass the ID of the div where the chart will be drawn
            });
        };
        document.body.appendChild(script);
    });


        
})    