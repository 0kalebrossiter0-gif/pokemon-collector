document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.pokemontcg.io/v2/cards";

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");
  const themeToggle = document.getElementById("themeToggle");

  if (!searchBtn || !searchInput || !resultsDiv) {
    console.error("Missing required HTML elements");
    return;
  }

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
    if (e.key === "Enter") {
      searchCards();
    }
  });

  /* =========================
     Search Cards
     ========================= */
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

        // Skip cards without proper front images
        if (!imageUrl || imageUrl.toLowerCase().includes("back")) return;

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const price =
          card.tcgplayer?.prices?.holofoil?.market ??
          card.t
