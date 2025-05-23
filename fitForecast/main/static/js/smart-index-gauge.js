// Developed from similar gauge found on https://codepen.io/andygongea/pen/LyVwEP
function animateGauge(value) {
    let path = document.getElementById("gauge-fill");
    let grey_path = document.getElementById("grey-gauge-fill")
    let length = path.getTotalLength(); // Get total path length

    // set the position of the coloured path
    path.style.strokeDasharray = length; // Full path visible
    path.style.strokeDashoffset = length; // Hide it initially
    // set the position of the grey background path 
    grey_path.style.strokeDasharray = length;
    grey_path.style.strokeDashoffset = 0; 

    // Force a reflow (required for animation to work) ChatGPT provided this while trying to debug.
    path.getBoundingClientRect();
    grey_path.getBoundingClientRect();

    // Animate stroke
    path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
    path.style.strokeDashoffset = length * (1 - value / 100);
    grey_path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
    grey_path.style.strokeDashoffset = (length * (1 - value / 100)) - length;
}   

// set colors for scores
function retrieveColor(index) {
    if (index <= 25) {
        return "red";
    } else if (index <= 40) {
        return "#e67e22"; // orange
    } else if (index <= 60) {
        return "#FFBF00"; // orangeish yellow
    } else if (index <= 80) {
        return "#32CD32"; // lime green
    } else {
        return "green";
    }
}

// Ensure the path starts hidden when page loads
document.addEventListener("WeatherDataUpdated", function(event) {
    
    let inValue = parseFloat(document.getElementById("result").textContent);
    // ensure animation doesnt break by going less than 1 or greater than 100
    let clampedValue = Math.min(100, Math.max(1, inValue));

    // set color of gauge fill and animate
    document.getElementById("gauge-fill").setAttribute("stroke", retrieveColor(clampedValue));
    animateGauge(clampedValue);
});
