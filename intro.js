document.addEventListener("DOMContentLoaded", function() {
    let loadingScreen = document.getElementById("loading-screen");
    let loadingText = document.querySelector("#loading-screen h2");
    let mainContent = document.getElementById("main-content");

    if (!loadingScreen || !loadingText || !mainContent) {
        console.error("⚠️ Missing elements! Check #loading-screen, #loading-screen h2, or #main-content.");
        return;
    }

    let loadMessages = [
        "Preparing the kitchen...",
        "Chopping vegetables...",
        "Firing up the grill...",
        "Setting up tables...",
        "Almost ready..."
    ];
    let index = 0;

    let messageInterval = setInterval(() => {
        if (index < loadMessages.length) {
            loadingText.innerText = loadMessages[index];
            index++;
        } else {
            clearInterval(messageInterval);
        }
    }, 1000);

    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
        mainContent.style.opacity = "1";
        console.log("✅ Main content is now visible.");
    }, loadMessages.length * 1000 + 2000);
});
