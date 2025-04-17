document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check for saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeToggle.innerHTML = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Save preference
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = "☀️ Light Mode";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = "🌙 Dark Mode";
        }
    });
});
