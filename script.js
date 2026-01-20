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

      // 🚫 Skip car
