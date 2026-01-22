const STORAGE_KEY = "pokemonCollection";

/* ---------- UTIL ---------- */
function getCollection() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCollection(collection) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

/* ---------- ADD CARD ---------- */
function addToCollection(card) {
  const collection = getCollection();

  if (!collection.find(c => c.id === card.id)) {
    collection.push(card);
    saveCollection(collection);
    alert(`${card.name} added to your collection!`);
  } else {
    alert("Card already in collection!");
  }
}

/* ---------- SEARCH (Pokémon TCG API) ---------- */
async function searchCards() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const res = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=name:${query}`
  );
  const data = await res.json();

  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";

  data.data.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${card.images.small}" />
      <h3>${card.name}</h3>
      <button>Add to Collection</button>
    `;

    div.querySelector("button").onclick = () =>
      addToCollection({
        id: card.id,
        name: card.name,
        image: card.images.small,
        supertype: card.supertype,
        rarity: card.rarity || "Unknown"
      });

    grid.appendChild(div);
  });
}

/* ---------- COLLECTION PAGE ---------- */
function loadCollection() {
  const container = document.getElementById("collectionGrid");
  if (!container) return;

  const collection = getCollection();
  container.innerHTML = "";

  if (collection.length === 0) {
    container.innerHTML = "<p>No cards collected yet.</p>";
    return;
  }

  collection.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${card.image}" />
      <h3>${card.name}</h3>
      <p>${card.rarity}</p>
    `;

    container.appendChild(div);
  });
}

/* ---------- STATS PAGE ---------- */
function loadStats() {
  const statsBox = document.getElementById("statsBox");
  if (!statsBox) return;

  const collection = getCollection();

  if (collection.length === 0) {
    statsBox.innerHTML = "<p>No stats yet — collect some cards!</p>";
    return;
  }

  const total = collection.length;
  const rarityCount = {};
  const typeCount = {};

  collection.forEach(card => {
    rarityCount[card.rarity] = (rarityCount[card.rarity] || 0) + 1;
    typeCount[card.supertype] = (typeCount[card.supertype] || 0) + 1;
  });

  statsBox.innerHTML = `
    <p><strong>Total Cards:</strong> ${total}</p>

    <h3>Rarity Breakdown</h3>
    ${Object.entries(rarityCount)
      .map(([k, v]) => `<p>${k}: ${v}</p>`)
      .join("")}

    <h3>Card Types</h3>
    ${Object.entries(typeCount)
      .map(([k, v]) => `<p>${k}: ${v}</p>`)
      .join("")}
  `;
}

/* ---------- AUTO LOAD ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadCollection();
  loadStats();
});
