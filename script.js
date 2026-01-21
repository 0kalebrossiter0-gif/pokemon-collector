// ==========================
// 📦 STORAGE HELPERS
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
  const input = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");
  const query = input.value.trim();

  resultsDiv.innerHTML = "";
  if (!query) return;

  try {
    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${query}`
    );
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      resultsDiv.innerHTML = "<p>No cards found.</p>";
      return;
    }

    data.data.forEach(card => {
      if (!card.images?.small) return;

      const price =
        card.cardmarket?.prices?.averageSellPrice ??
        card.tcgplayer?.prices?.holofoil?.market ??
        "N/A";

      const cardDiv = document.createElement("div");
      cardDiv.className = "card";

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
    resultsDiv.innerHTML = "<p>Error loading cards.</p>";
  }
}

// ==========================
// ➕ ADD TO COLLECTION
// ==========================
function addToCollection(card) {
  const collection = getCollection();

  // Prevent duplicates
  if (collection.some(c => c.id === card.id)) {
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
}

// ==========================
// 📚 LOAD COLLECTION PAGE
// ==========================
function loadCollection() {
  const container = document.getElementById("collection");
  if (!container) return;

  const collection = getCollection();
  container.innerHTML = "";

  if (collection.length === 0) {
    container.innerHTML = "<p>No cards in your collection yet.</p>";
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

    div.querySelector(".delete").onclick = () => removeCard(card.id);
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
}
