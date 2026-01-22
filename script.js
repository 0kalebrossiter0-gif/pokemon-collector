function searchPokemon() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    alert("Please enter a Pokémon name!");
    return;
  }

  alert(`Searching for ${query} (API coming next 👀)`);
}
