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
            } else if (item.type === "image") {
                element = document.createElement("img");
                element.src = item.src;
            }

            tile.appendChild(element);
        });

        container.appendChild(tile);

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
    document.addEventListener("WeatherDataUpdatedTiles", function(event) {
        const weatherData = event.detail;

        createTile({
            rows: 2,
            cols: 2,
            content: [
                { type: "text", value: `${weatherData.temperature}°C`},
                { type: "image", src: "/static/images/profile-pic.png" },
                { type: "text", value: `${weatherData.wind}kph` },
                { type: "text", value: `UV:${weatherData.uv}` }
            ]
        });
    });
});
