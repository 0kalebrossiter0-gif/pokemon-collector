document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.pokemontcg.io/v2/cards";

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  if (!searchBtn || !searchInput || !resultsDiv) {
    console.error("Missing required HTML elements");
    return;
  }

  // Search button click
  searchBtn.addEventListener("click", searchCards);

  // Enter key search
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchCards();
    }
  });

  async function searchCards() {
    const query = searchInput.value.trim();

    if (!query) {
      resultsDiv.innerHTML = "<p>Please enter a Pokémon name.</p>";
      return;
    }

    resultsDiv.innerHTML = "<p>Loading cards...</p>";

    try {
      const response = await fetch(
        `${API_URL}?q=name:${query}&pageSize=100`
      );
      const data = await response.json();

      resultsDiv.innerHTML = "";

      if (!data.data || data.data.length === 0) {
        resultsDiv.innerHTML = "<p>No cards found.</p>";
        return;
      }

      data.data.forEach((card) => {
        const imageUrl = card.images?.small;

        // Skip cards without a proper front image
        if (!imageUrl || imageUrl.toLowerCase().includes("back")) return;

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const price =
          card.tcgplayer?.prices?.holofoil?.market ??
          card.tcgplayer?.prices?.normal?.market ??
          null;

        const setName = card.set?.name || "Unknown Set";
        const cardNumber = card.number
          ? `#${card.number}/${card.set?.printedTotal || "?"}`
          : "";
        const rarity = card.rarity ? `(${card.rarity})` : "";

        cardDiv.innerHTML = `
          <img src="${imageUrl}" alt="${card.name}">
          <h3>${card.name}</h3>
          <p class="details">${setName} ${cardNumber} ${rarity}</p>
          <p class="price">${price ? `$${price}` : "Price not available"}</p>
          <button>Add to Collection</button>
        `;

        cardDiv.querySelector("button").addEventListener("click", () => {
          saveCard(card);
        });

        resultsDiv.appendChild(cardDiv);
      });
    } catch (error) {
      console.error(error);
      resultsDiv.innerHTML = "<p>Error loading cards.</p>";
    }
  }

  function saveCard(card) {
    const collection = JSON.parse(localStorage.getItem("collection")) || [];

    const exists = collection.some(
      (savedCard) => savedCard.id === card.id
    );

    if (exists) {
      alert("This card is already in your collection.");
      return;
    }

    collection.push(card);
    localStorage.setItem("collection", JSON.stringify(collection));
    alert("Added to collection!");
  }
});
