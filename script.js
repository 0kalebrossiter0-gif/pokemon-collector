document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.pokemontcg.io/v2/cards";

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");
  const themeToggle = document.getElementById("themeToggle");

  if (!searchBtn || !searchInput || !resultsDiv) return;

  /* =========================
     Theme Toggle
     ========================= */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      themeToggle.textContent =
        document.body.classList.contains("light") ? "☀️" : "🌙";
    });
  }

  /* =========================
     Search Events
     ========================= */
  searchBtn.addEventListener("click", searchCards);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchCards();
  });

  /* =========================
     Search Cards
     ========================= */
  async function searchCards() {
    const query = searchInput.value.trim();
    if (!query) return;

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
        if (!imageUrl) return;

        const price =
          card.tcgplayer?.prices?.holofoil?.market ??
          card.tcgplayer?.prices?.normal?.market ??
          null;

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        cardDiv.innerHTML = `
          <img src="${imageUrl}" alt="${card.name}">
          <h3>${card.name}</h3>
          <p class="details">
            ${card.set?.name || "Unknown Set"}
            ${card.number ? `#${card.number}` : ""}
          </p>
          <p class="price">
            ${price ? `$${price.toFixed(2)}` : "Price not available"}
          </p>
          <button>Add to Collection</button>
        `;

        cardDiv.querySelector("button").addEventListener("click", () => {
          saveCard(card);
        });

        resultsDiv.appendChild(cardDiv);
      });
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = "<p>Error loading cards.</p>";
    }
  }

  /* =========================
     Save Card (No Duplicates)
     ========================= */
  function saveCard(card) {
    const collection =
      JSON.parse(localStorage.getItem("collection")) || [];

    if (collection.some((c) => c.id === card.id)) {
      alert("This card is already in your collection.");
      return;
    }

    collection.push(card);
    localStorage.setItem("collection", JSON.stringify(collection));
    alert("Added to collection!");
  }
});
