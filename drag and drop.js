document.addEventListener("DOMContentLoaded", function() {
    const ingredientsContainer = document.getElementById("ingredients");
    const foodArea = document.getElementById("food");

    const ingredients = ["Tomato", "Cheese", "Lettuce", "Bread", "Meat"];
    
    ingredients.forEach(ingredient => {
        let ingredientDiv = document.createElement("div");
        ingredientDiv.innerText = ingredient;
        ingredientDiv.classList.add("draggable");
        ingredientDiv.draggable = true;
        ingredientDiv.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text", ingredient);
        });
        ingredientsContainer.appendChild(ingredientDiv);
    });

    foodArea.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    foodArea.addEventListener("drop", (event) => {
        event.preventDefault();
        let droppedItem = event.dataTransfer.getData("text");
        let foodItem = document.createElement("div");
        foodItem.innerText = droppedItem;
        foodItem.classList.add("food-item");
        foodArea.appendChild(foodItem);
    });
});