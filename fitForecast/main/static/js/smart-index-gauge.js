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
    path.style.strokeDashoffset = length * (1 - value / 100) + 5;
    grey_path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
    grey_path.style.strokeDashoffset = (length * (1 - value / 100)) - length - 5;
}   

// Ensure the path starts hidden when page loads
document.addEventListener("DOMContentLoaded", function() {
    animateGauge(75);
});