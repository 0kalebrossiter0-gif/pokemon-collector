async function searchPokemon() {
  const input = document.getElementById("searchInput");
  const query = input.value.trim();
  const grid = document.getElementById("cardGrid");

  if (!query) {
    alert("Please enter a Pokémon name!");
    return;
  }

  grid.innerHTML = "Loading cards...";

  try {
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${query}`
    );

    const data = await response.json();
    const cards = data.data;

    if (cards.length === 0) {
      grid.innerHTML = "No cards found 😢";
      return;
    }

    grid.innerHTML = "";

    cards.slice(0, 24).forEach(card => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";

      cardEl.innerHTML = `
        <img src="${card.images.small}" alt="${card.name}" />
        <h3>${card.name}</h3>
        <p>Set: ${card.set.name}</p>
        <p>Rarity: ${card.rarity || "Unknown"}</p>
      `;

      grid.appendChild(cardEl);
    });

  } catch (error) {
    grid.innerHTML = "Error loading cards ⚠️";
    console.error(error);
  }
}
