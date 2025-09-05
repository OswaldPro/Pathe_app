document.addEventListener("DOMContentLoaded", () => {
  let allFilms = [];

  // Fonction d’affichage d’un film
  function displayFilmCard(film, indexFilm) {
    let mentionFrisson = film.mention_frisson ? `<span class="badge-frisson">Frisson</span>` : "";
    let nouveau = film.nouveau ? `<span class="badge-nouveau">Nouveau</span>` : "";
    let genres = film.genre.join(", ");

    // durée formatée
    let duree = film.durée_minutes;
    let heures = Math.floor(duree / 60);
    let minutes = duree % 60;
    let dureeFormatee = `(${heures}h${minutes.toString().padStart(2, "0")})`;

    let agemin = film.âge_minimum > 11 ? `<span class="avert">-12</span>` : "";
    let avert = film.avertissement_violence ? `<span class="avert">!</span>` : "";

    // Séances
    const langueChoisie = document.getElementById("langue").value; // VF ou VOST ou ""

    let seanceCards = film.séances
      .filter(s => {
        if (!langueChoisie) return true; // si aucune langue choisie, on garde tout
        if (langueChoisie === "VF" && s.vf) return true;
        if (langueChoisie === "VOST" && s.vost) return true;
        return false;
      })

      .map((s, indexSeance) => {
      let options = [];
      if (s.imax) options.push("IMAX");
      if (s["4D"]) options.push("4DX");

      let langue = s.vf ? "VF" : s.vost ? "VOST" : "";
      let handi = s.handicap ? `<img src="/assets/IMAGES/PICTOS/handicap.png" alt="Accès handicapé">` : "";

      let idSeance = `film${indexFilm}-seance${indexSeance}`;

      return `
        <div class="seance-cards" data-id="${idSeance}">
          <div class="card-wrapper">
            <div class="col-card-40">
              <span class="options">${options.join(" ")}</span>
              <span class="horaire">${s.horaire}</span>
            </div>
            <div class="col-card-33 langue">${langue}</div>
            <div class="col-card-27 handi">${handi}</div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="film-card">
        <div class="film-item-top">
          <img src="/assets/IMAGES/FILMS/${film.image}" alt="Affiche du film ${film.titre}" class="poster-mini">
          <div class="film-info">
            <div class="mentions">${mentionFrisson} ${nouveau}</div>
            <h2>${film.titre}</h2>
            <div class="film-details">
              <p>${genres}</p>
              <p>${dureeFormatee}</p>
              ${agemin}
              ${avert}
            </div>
          </div>
        </div>
        <div class="seances">
          ${seanceCards}
        </div>
      </div>
    `;
  }

  // Fonction pour afficher une liste de films
  function renderFilms(films) {
    const filmsList = document.getElementById("filmsList");
    filmsList.innerHTML = films.map((film, indexFilm) => displayFilmCard(film, indexFilm)).join("");

    //Fonction pour cliquer sur la carte et aller sur la page
  document.querySelectorAll(".seance-cards").forEach(card => {
  card.addEventListener("click", () => {
    let seanceId = card.dataset.id; // récupère l’ID
    window.location.href = `/pages/bookingPage.html?seance=${seanceId}`;
      });
    });

  }

  // Fonction de filtrage
  function applyFilters() {
    const genre = document.getElementById("filmType").value;
    const langue = document.getElementById("langue").value;
    const only4k = document.querySelector("input[name='is4K']").checked;
    const query = document.querySelector("input[name='query']").value.toLowerCase();

    let filtered = allFilms.filter(film => {
      if (genre && !film.genre.includes(genre)) return false;
      if (langue) {
        let hasLangue = film.séances.some(s =>
          (langue === "VF" && s.vf) || (langue === "VOST" && s.vost)
        );
        if (!hasLangue) return false;
      }
      if (only4k && !film.séances.some(s => s["4k"])) return false;
      if (query && !film.titre.toLowerCase().includes(query)) return false;
      return true;
    });

    renderFilms(filtered);
  }

  // Récupération des films
  fetch("/data/JSON/films.json")
    .then(response => {
      if (!response.ok) throw new Error("Erreur : pas de fichier JSON chargé");
      return response.json();
    })
    .then(data => {
      allFilms = data;
      renderFilms(allFilms); // affichage initial
    })
    .catch(error => console.error("Erreur JSON :", error));

  // Events filtres
  const form = document.querySelector(".search-bar");
  form.addEventListener("submit", e => {
    e.preventDefault();
    applyFilters();
  });

  document.getElementById("filmType").addEventListener("change", applyFilters);
  document.getElementById("langue").addEventListener("change", applyFilters);
  document.querySelector("input[name='is4K']").addEventListener("change", applyFilters);
  document.querySelector("input[name='query']").addEventListener("input", applyFilters);

  
});
