// ==========================
// 🔊 AUDIO SYSTEM (WAV)
// ==========================
let soundEnabled = false;

const sounds = {
  search: new Audio("search.wav"),
  add: new Audio("add.wav"),
  error: new Audio("error.wav")
};

// Enable sound after first user interaction (Chrome requirement)
document.addEventListener("click", () => {
  soundEnabled = true;
}, { once: true });

function playSound(name) {
  if (!soundEnabled) return;
  if (!sounds[name]) return;
  sounds[name].currentTime = 0;
  sounds[name].play().catch(() => {});
}

// ==========================
// 📦 STORAGE
// ==========================
function getCollection() {
  return JSON.parse(localStorage.getItem("collection")) || [];
}

function saveCollection(cards) {
  localStorage.setItem("collection", JSON.stringify(cards));
}

// ==========================
// 🔍 SEARCH CARDS
// ==========================
async function searchCards() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";
  if (!query) return;

  playSound("search");

  try {
    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${query}`
    );
    const data = await res.json();

    data.data.forEach(card => {
      if (!card.images?.small) return;

      const cardDiv = document.createElement("div");
      cardDiv.className = "card";

      const price =
        card.cardmarket?.prices?.averageSellPrice ??
        card.tcgplayer?.prices?.holofoil?.market ??
        "N/A";

      cardDiv.innerHTML = `
        <img src="${card.images.small}" alt="${card.name}">
        <h3>${card.name}</h3>
        <p class="price">$${price}</p>
        <button>Add to Collection</button>
      `;

      cardDiv.querySelector("button").onclick = () => addToCollection(card);
      resultsDiv.appendChild(cardDiv);
    });

  } catch (err) {
    console.error(err);
    playSound("error");
  }
}

// ==========================
// ➕ ADD TO COLLECTION
// ==========================
function addToCollection(card) {
  const collection = getCollection();

  // Prevent duplicates
  if (collection.some(c => c.id === card.id)) {
    playSound("error");
    alert("This card is already in your collection.");
    return;
  }

  collection.push({
    id: card.id,
    name: card.name,
    image: card.images.small,
    rarity: card.rarity || "Unknown",
    price:
      card.cardmarket?.prices?.averageSellPrice ??
      card.tcgplayer?.prices?.holofoil?.market ??
      0
  });

  saveCollection(collection);
  playSound("add");
}

// ==========================
// 📚 LOAD COLLECTION (collection.html)
// ==========================
function loadCollection() {
  const container = document.getElementById("collection");
  if (!container) return;

  container.innerHTML = "";
  const collection = getCollection();

  if (collection.length === 0) {
    container.innerHTML = "<p>No cards yet.</p>";
    return;
  }

  collection.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${card.image}">
      <h3>${card.name}</h3>
      <p>${card.rarity}</p>
      <p class="price">$${card.price || "N/A"}</p>
      <button class="delete">Delete</button>
    `;

    div.querySelector(".delete").onclick = () => {
      removeCard(card.id);
    };

    container.appendChild(div);
  });
}

// ==========================
// ❌ REMOVE CARD
// ==========================
function removeCard(id) {
  let collection = getCollection();
  collection = collection.filter(card => card.id !== id);
  saveCollection(collection);
  loadCollection();
  playSound("error");
}
