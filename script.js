const API_URL = "https://api.pokemontcg.io/v2/cards";

const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

if (searchBtn) {
  searchBtn.addEventListener("click", searchCards);
}

async function searchCards() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    resultsDiv.innerHTML = "Please enter a Pokémon name.";
    return;
  }

  resultsDiv.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_URL}?q=name:${query}&pageSize=40`);
    const data = await res.json();
    resultsDiv.innerHTML = "";

    data.data.forEach(card => {
      const imageUrl = card.images?.small;

      // Only show real front images
      if (!imageUrl || imageUrl.toLowerCase().includes("back")) return;

      const div = document.createElement("div");
      div.className = "card";

      const price =
        card.tcgplayer?.prices?.holofoil?.market ??
        card.tcgplayer?.prices?.normal?.market ??
        null;

      div.innerHTML = `
        <img src="${imageUrl}" alt="${card.name}" />
        <h3>${card.name}</h3>
        <p class="price">${price ? `$${price}` : "No market price"}</p>
        <button>Add to Collection</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        saveCard(card);
      });

      resultsDiv.appendChild(div);
    });

  } catch (err) {
    resultsDiv.innerHTML = "Error loading cards.";
  }
}

function saveCard(card) {
  const collection = JSON.parse(localStorage.getItem("collection")) || [];
  collection.push(card);
  localStorage.setItem("collection", JSON.stringify(collection));
  alert("Added to collection!");
}
