const API_URL = "https://api.pokemontcg.io/v2/cards";

/* ---------- COLLECTION STORAGE ---------- */

function getCollection() {
  return JSON.parse(localStorage.getItem("collection")) || [];
}

function saveCollection(collection) {
  localStorage.setItem("collection", JSON.stringify(collection));
}

/* ---------- SEARCH ---------- */

async function searchCards() {
  const query = document.getElementById("searchInput").value;
  const res = await fetch(`${API_URL}?q=name:${query}`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.data.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${card.images.small}">
      <button onclick='addToCollection(${JSON.stringify(card)})'>Add</button>
    `;
    results.appendChild(div);
  });
}

/* ---------- ADD TO COLLECTION ---------- */

function addToCollection(card) {
  const collection = getCollection();
  if (!collection.find(c => c.id === card.id)) {
    collection.push(card);
    saveCollection(collection);
    alert("Added to collection!");
  }
}

/* ---------- LOAD COLLECTION ---------- */

function loadCollection() {
  const grid = document.getElementById("collectionGrid");
  if (!grid) return;

  const collection = getCollection();
  grid.innerHTML = "";

  collection.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${card.images.small}">`;
    grid.appendChild(div);
  });
}

/* ---------- STATS ---------- */

function loadStats() {
  const box = document.getElementById("statsBox");
  if (!box) return;

  const collection = getCollection();
  if (collection.length === 0) {
    box.innerHTML = "<p>No cards collected yet.</p>";
    return;
  }

  const total = collection.length;
  const rarityCount = {};

  collection.forEach(card => {
    rarityCount[card.rarity] = (rarityCount[card.rarity] || 0) + 1;
  });

  let html = `<p>Total Cards: ${total}</p>`;

  for (const [rarity, count] of Object.entries(rarityCount)) {
    const percent = Math.round((count / total) * 100);
    html += `
      <div class="stat-row">
        <div class="stat-label">${rarity} (${count})</div>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="--target-width:${percent}%"></div>
        </div>
      </div>
    `;
  }

  box.innerHTML = html;
}

/* ---------- AUTO LOAD ---------- */
window.onload = () => {
  loadCollection();
};
