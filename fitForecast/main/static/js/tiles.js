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
        tile.innerHTML = `
            <button class="delete-btn">X</button>
            <p>${content}</p>
        `;

        // Delete functionality
        tile.querySelector(".delete-btn").addEventListener("click", function () {
            tile.remove();
        });

        // Swipe functionality (for touch and mouse)
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
            if (endX - startX > 100) {
                // Swipe right detected, add 'swiped' class to start the animation
                tile.classList.add("swiped");

                // Wait for the animation to end, then remove the tile from the DOM
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
            if (isMouseDown && mouseEndX - mouseStartX > 100) {
                // Swipe right detected on mouse drag
                tile.classList.add("swiped");

                // Wait for the animation to end, then remove the tile from the DOM
                tile.addEventListener('transitionend', function () {
                    tile.remove();
                });
            }
            isMouseDown = false;
        });

        container.appendChild(tile);
    }

    addTileBtn.addEventListener("click", function () {
        createTile(`Tile ${container.children.length + 1}`);
    });

    // Example initial tiles
    createTile("Tile 1");
    createTile("Tile 2");
});
