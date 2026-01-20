const API_URL = "https://api.pokemontcg.io/v2/cards";

// SEARCH CARDS
const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", searchCards);
}

async function searchCards() {
  const query = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = "Please enter a card name.";
    return;
  }

  resultsDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(`${API_URL}?q=name:${query}`);
    const data = await response.json();

    resultsDiv.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      resultsDiv.innerHTML = "No cards found.";
      return;
    }

    data.data.forEach(card => {
      // FILTER BAD CARDS
      if (!card.name || !card.images || !card.images.small) return;

      const div = document.createElement("div");
      div.className = "card";

      const price =
        card.tcgplayer?.prices?.holofoil?.market ??
        card.tcgplayer?.prices?.normal?.market ??
        null;

      div.innerHTML = `
        <img src="${card.images.small}" alt="${card.name}" />
        <h3>${card.name}</h3>
        <p class="price">
          ${price ? `$${price}` : "No market price"}
        </p>
        <button>Add to Collection</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        saveCard(card);
      });

      resultsDiv.appendChild(div);
    });
  } catch (error) {
    resultsDiv.innerHTML = "Error loading cards.";
  }
}

// SAVE CARD
function saveCard(card) {
  const collection = JSON.parse(localStorage.getItem("collection")) || [];
  collection.push(card);
  localStorage.setItem("collection", JSON.stringify(collection));
  alert("Card added to collection!");
}

// LOAD COLLECTION PAGE
const collectionDiv = document.getElementById("collection");

if (collectionDiv) {
  const collection = JSON.parse(localStorage.getItem("collection")) || [];

  if (collection.length === 0) {
    collectionDiv.innerHTML = "No cards in your collection yet.";
  }

  collection.forEach(card => {
    if (!card.name || !card.images || !card.images.small) return;

    const div = document.createElement("div");
    div.className = "card";

    const price =
      card.tcgplayer?.prices?.holofoil?.market ??
      card.tcgplayer?.prices?.normal?.market ??
      null;

    div.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}" />
      <h3>${card.name}</h3>
      <p class="price">
        ${price ? `$${price}` : "No market price"}
      </p>
    `;

    collectionDiv.appendChild(div);
  });
}

