function animateGauge(value) {
    let path = document.getElementById("gauge-fill");
    let grey_path = document.getElementById("grey-gauge-fill")
    let length = path.getTotalLength(); // Get total path length

    path.style.strokeDasharray = length; // Full path visible
    path.style.strokeDashoffset = length; // Hide it initially
    grey_path.style.strokeDasharray = length; // Full path visible
    grey_path.style.strokeDashoffset = 0; // Hide it initially

    // Force a reflow (required for animation to work)
    path.getBoundingClientRect();
    grey_path.getBoundingClientRect();

    // Animate stroke
    path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
    path.style.strokeDashoffset = length * (1 - value / 100);
    grey_path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
    grey_path.style.strokeDashoffset = (length * (1 - value / 100)) - length;
}   

function retrieveColor(index) {
    if (index <= 25) {
        return "red";
    } else if (index <= 40) {
        return "orange";
    } else if (index <= 60) {
        return "yellow";
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