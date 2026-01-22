const API = "https://api.pokemontcg.io/v2/cards";
const modal = document.getElementById("modal");

function getCollection() {
  return JSON.parse(localStorage.getItem("collection") || "[]");
}

function saveCollection(col) {
  localStorage.setItem("collection", JSON.stringify(col));
}

async function searchPokemon() {
  const q = document.getElementById("searchInput").value;
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "Loading...";

  const res = await fetch(`${API}?q=name:${q}`);
  const data = await res.json();

  grid.innerHTML = "";
  data.data.slice(0, 24).forEach(card => renderCard(card, grid));
}

function renderCard(card, grid) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <img src="${card.images.small}">
    <h3>${card.name}</h3>
  `;
  div.onclick = () => openModal(card);
  grid.appendChild(div);
}

function openModal(card) {
  modal.innerHTML = `
    <div class="modal-content">
      <img src="${card.images.small}">
      <h3>${card.name}</h3>
      <p>${card.set.name}</p>
      <button onclick="addToCollection('${card.id}')">Add</button>
      <button onclick="closeModal()">Close</button>
    </div>`;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

async function addToCollection(id) {
  const col = getCollection();
  if (col.includes(id)) return;
  col.push(id);
  saveCollection(col);
  closeModal();
}

async function loadCollection() {
  const grid = document.getElementById("collectionGrid");
  const col = getCollection();
  grid.innerHTML = "";

  for (const id of col) {
    const res = await fetch(`${API}/${id}`);
    const card = (await res.json()).data;
    renderCard(card, grid);
  }
}

async function loadStats() {
  const box = document.getElementById("statsBox");
  const col = getCollection();
  box.innerHTML = `
    <p>Total Cards: ${col.length}</p>
  `;
}
