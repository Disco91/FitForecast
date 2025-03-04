document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("tileContainer");
    const addTileBtn = document.getElementById("addTile");

    // Check if elements exist to prevent errors
    if (!container || !addTileBtn) {
        console.error("Tile container or add tile button not found!");
        return;
    }

    function createTile(content = "New Tile") {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.innerHTML = `<p>${content}</p>`; // Removed button

        // SWIPE FUNCTIONALITY (FOR TOUCH AND MOUSE)
        let startX = 0;
        let endX = 0;

        // For mobile devices (touch events)
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

        // For desktop devices (mouse events)
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
    addTileBtn.addEventListener("click", function () {
        createTile(`Tile ${container.children.length + 1}`);
    });

    // Example initial tiles
    createTile("Tile 1");
    createTile("Tile 2");
});
