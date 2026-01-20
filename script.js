document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.pokemontcg.io/v2/cards";

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  if (!searchBtn || !searchInput || !resultsDiv) {
    console.error("Required elements not found");
    return;
  }

  // Click search
  searchBtn.addEventListener("click", searchCards);

  // Press Enter to search
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchCards();
    }
  });

  async function searchCards() {
    const query = searchInput.value.trim();

    if (!query) {
      resultsDiv.innerHTML = "Please enter a Pokémon name.";
      return;
    }

    resultsDiv.innerHTML = "Loading...";

    try {
      const res = await fetch(
        `${API_URL}?q=name:${query}&pageSize=100`
      );
      const data = await res.json();

      resultsDiv.innerHTML = "";

      if (!data.data || data.data.length === 0) {
        resultsDiv.innerHTML = "No cards found.";
        return;
      }

      data.data.forEach(card => {
        const imageUrl = card.images?.small;

        // Skip invalid or back images
        if (!imageUrl || imageUrl.toLowerCase().includes("back")) return;

        const div = document.createElement("div");
        div.className = "card";

        const price =
          card.tcgplayer?.prices?.holofoil?.market ??
          card.tcgplayer?.prices?.normal?.market ??
          null;

        const setName = card.set?.name || "Unknown Set";
        const cardNumber = card.number
          ? `#${card.number}/${card.set?.printedTotal || "?"}`
          : "";
        const rarity = card.rarity ? `(${card.rarity})` : "";

        div.innerHTML = `
          <img src="${imageUrl}" alt="${card.name}" />
          <h3>${card.name}</h3>
          <p class="details">
            ${setName} ${cardNumber} ${rarity}
          </p>
          <p class="price">
            ${price ? `$${price}` : "Price not available"}
          </p>
          <button>Add to Collection</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
          saveCard(card);
        });

        resultsDiv.appendChild(div);
      });

    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = "Error loading cards.";
    }
  }

  function saveCard(card) {
    const collection = JSON.parse(localStorage.getItem("collection")) || [];
    collection.push(card);
    localStorage.setItem("collection", JSON.stringify(collection));
    alert("Added to collection!");
  }
});

