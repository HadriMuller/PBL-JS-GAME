// Pause System Variables
let isPaused = false;

// Function to Pause the Game
function pauseGame() {
  isPaused = true;
  timerIntervals.forEach((interval, i) => clearInterval(timerIntervals[i]));
  document.getElementById("pause-overlay").style.display = "flex";
}

// Function to Resume the Game
function resumeGame() {
  isPaused = false;
  for (let i = 0; i < customerElements.length; i++) {
    startTimer(i); // restart timer for each customer
  }
  document.getElementById("pause-overlay").style.display = "none";
}

const customerImages = [
    "img/customer1.jpg",
    "img/customer2.jpg",
    "img/customer3.jpg",
    "img/customer4.jpg",
    "img/customer5.png",
];
  
const ingredientImageMap = {
  "top-bun":    "img/top-bun.png",
  "bottom-bun": "img/bottom-bun.png"
};

const recipeList = [
  { name: "Mega Bacon Bomb",      ingredients: ["bottom-bun","patty","bacon","cheese","lettuce","top-bun"] },
  { name: "Healthy Green Burger", ingredients: ["bottom-bun","lettuce","tomato","onion","top-bun"] },
  { name: "Classic Patty Stack",  ingredients: ["bottom-bun","patty","cheese","top-bun"] },
  { name: "The Cheesy Patty Supreme", ingredients: ["bottom-bun","patty","cheese","mayo","top-bun"] },
  { name: "Spicy Bacon Burger",    ingredients: ["bottom-bun","patty","bacon","onion","pickle","ketchup","shiracha","top-bun"] },
  { name: "The Ultimate Combo King", ingredients: ["bottom-bun","patty","bacon","cheese","tomato","lettuce","mayo","onion","pickle","top-bun"] },
];

const customerElements = [
  { face: "customer1", order: "order1", timer: "timer1" },
  { face: "customer2", order: "order2", timer: "timer2" },
  { face: "customer3", order: "order3", timer: "timer3" },
];

const customers = [
    {
      containerId: "customer1",
      orderId: "order1",
      timerId: "timer1",
      imageElement: document.querySelector("#customer1 img"),
      currentImage: "",
    },
    {
      containerId: "customer2",
      orderId: "order2",
      timerId: "timer2",
      imageElement: document.querySelector("#customer2 img"),
      currentImage: "",
    },
    {
      containerId: "customer3",
      orderId: "order3",
      timerId: "timer3",
      imageElement: document.querySelector("#customer3 img"),
      currentImage: "",
    },
];  

let currentOrders   = [];
let scores          = 0;
let madCustomers    = 0;
let timers          = [50, 50, 50];
let timerIntervals  = [null, null, null];

const makeFoodArea = document.getElementById("make-food-area");
const plate        = document.getElementById("cooking-plate");
const trashCan     = document.getElementById("trash-can");

function loadGame() {
  scores = 0;
  madCustomers = 0;
  timers = [50,50,50];
  makeFoodArea.innerHTML = "";
  currentOrders = [];

  for (let i = 0; i < customerElements.length; i++) {
    spawnOrder(i);
    startTimer(i);
  }

  document.getElementById("end-screen").style.display = "none";
  updateScore();
  updateMadScore();
}

function spawnOrder(index) {
    timers[index] = 50;
  const order = recipeList[Math.floor(Math.random() * recipeList.length)];
  const randomImage = customerImages[Math.floor(Math.random() * customerImages.length)];

  customers[index].currentImage = randomImage;
  customers[index].imageElement.src = randomImage;
  document.getElementById(customers[index].orderId).innerText = order.name;
  currentOrders[index] = order;
}

function startTimer(index) {
  if (timerIntervals[index]) clearInterval(timerIntervals[index]);
  const timerEl = document.getElementById(customerElements[index].timer);

  timerIntervals[index] = setInterval(() => {
    if (isPaused) return;
    timers[index]--;
    timerEl.innerText = timers[index];
    if (timers[index] === 10) {
      document.getElementById(customerElements[index].face).classList.add("urgent");
    }
    if (timers[index] <= 0) {
      clearInterval(timerIntervals[index]);
      handleFreakyCustomer(index);
    }
  }, 1000);
}

function serveOrder(index) {
    
    const servesound = document.getElementById("sfx-bell");
    servesound.volume = 0.4;
    servesound.play();

  if (isPaused) return;
  const served = Array.from(makeFoodArea.querySelectorAll("img")).map(img =>
    img.dataset.name || img.src.split("/").pop().replace(".png","").replace("-burned","")
  );
  const expected = currentOrders[index].ingredients;
  const burned   = Array.from(makeFoodArea.querySelectorAll("img")).some(img =>
    img.classList.contains("burned")

  );

  if (burned) {
    handleFreakyCustomer(index);
    return;
  }

  if (JSON.stringify(served) === JSON.stringify(expected)) {
    scores++;
    updateScore();
    makeFoodArea.innerHTML = "";
    spawnOrder(index);
    startTimer(index);
    if (scores >= 5) endGame(true);
  } else {
    handleFreakyCustomer(index);
  }
}

function handleFreakyCustomer(index) {
    const faceImg = customers[index].imageElement;
    faceImg.classList.add("freaky");
    madCustomers++;
    updateMadScore();
  
    if (madCustomers >= 3) {
      endGame(false);
    } else {
      setTimeout(() => {
        faceImg.classList.remove("freaky", "urgent");
        spawnOrder(index);
        startTimer(index);
      }, 1000);
    }
  }
  
function updateScore() {
  document.getElementById("score-display").innerText = `Score: ${scores}`;
}

function updateMadScore() {
  const el = document.getElementById("mad-score-display");
  el.innerText = `Mad Customers: ${madCustomers} / 3`;
  el.classList.add("alert");
  setTimeout(() => el.classList.remove("alert"), 500);
}

function endGame(passed) {
  timerIntervals.forEach(id => clearInterval(id));
  document.getElementById("end-screen").style.display = "flex";
  document.getElementById("end-message").innerText = passed
    ? "🎉 You Completed This Game!"
    : "😡 You Failed This Game!";
}

function playAgain() {
  customerElements.forEach(({face}) => {
    const el = document.getElementById(face);
    el.classList.remove("freaky","urgent");
  });
  loadGame();
}

function goHome() {
  window.location.href = "index.html";
}

// Drag & Drop Logic

document.querySelectorAll(".ingredient").forEach(item => {
  item.draggable = true;
  item.addEventListener("dragstart", e => {
    if (isPaused) return;
    e.dataTransfer.setData("ingredient", item.dataset.name);
  });
});

makeFoodArea.addEventListener("dragover", e => { if (!isPaused) e.preventDefault(); });
makeFoodArea.addEventListener("drop", e => {
  if (isPaused) return;
  e.preventDefault();

  const rawHTML = e.dataTransfer.getData("text/plain");
  let img;

  if (rawHTML && rawHTML.includes("<img")) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawHTML;
    img = tempDiv.querySelector("img");

    if (img) {
      img.classList.remove("to-be-removed");
      makeFoodArea.appendChild(img);

      img.addEventListener("dragstart", ev => {
        if (isPaused) return;
        ev.dataTransfer.setData("text/plain", img.outerHTML);
        img.classList.add("to-be-removed");
      });

      // Remove original dragged element
      const allImgs = document.querySelectorAll("img.to-be-removed");
      allImgs.forEach(el => el.remove());
    }
  } else {
    const name = e.dataTransfer.getData("ingredient");
    const src = ingredientImageMap[name] || `img/${name}.png`;

    img = document.createElement("img");
    img.src = src;
    img.dataset.name = name;
    img.className = "ingredient-dropped";
    img.draggable = true;

    img.addEventListener("dragstart", ev => {
      if (isPaused) return;
      ev.dataTransfer.setData("text/plain", img.outerHTML);
    });

    makeFoodArea.appendChild(img);
  }
});

trashCan.addEventListener("dragover", e => { if (!isPaused) e.preventDefault(); });
trashCan.addEventListener("drop", e => {
  if (isPaused) return;
  e.preventDefault();
  const name = e.dataTransfer.getData("ingredient");

  makeFoodArea.querySelectorAll("img").forEach(img => {
    if ((img.dataset.name || "").includes(name)) img.remove();
  });
});

  
trashCan.addEventListener("dragover", e => { if (!isPaused) e.preventDefault(); });
trashCan.addEventListener("drop", e => {
  if (isPaused) return;
  e.preventDefault();
  const name = e.dataTransfer.getData("ingredient");
  ["make-food-area","cooking-plate"].forEach(id => {
    document.getElementById(id).querySelectorAll("img").forEach(img => {
      if ((img.dataset.name||"").includes(name)) img.remove();
    });
  });
});

function populateRecipeBook() {
  const list = document.getElementById("recipe-list");
  list.innerHTML = "";
  recipeList.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name}: ${r.ingredients.join(", ")}`;
    list.appendChild(li);
  });
}

document.getElementById("recipe-book-btn").addEventListener("click", () => {
  if (isPaused) return;
  const panel = document.getElementById("recipe-book");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

// Toggle pause when 'T' key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "t") {
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    }
  });

loadGame();
populateRecipeBook();
