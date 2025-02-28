document.addEventListener("DOMContentLoaded", () => {
    const sportsPills = document.querySelectorAll('.sport');

    // Function to handle pill selection
    const selectPill = (pill) => {
        sportsPills.forEach(p => p.classList.remove('selected')); // Remove 'selected' class from all pills
        pill.classList.add('selected'); // Add 'selected' class to the clicked pill
    };

    // Add event listener to each pill
    sportsPills.forEach(pill => {
        pill.addEventListener('click', () => selectPill(pill));
    });

    // Select the first pill by default
    if (sportsPills.length > 0) {
        selectPill(sportsPills[0]); // Automatically select the first pill
    }
});
