
// Fonction d'init partie gauche
export function initBookingLeft(film, seance, horaireFin, langue) {
  // Partie gauche "static" avec les infos de la séance


  //Pour le bg selectionne la div concerné et on change le bg avec l'image du film
  document.querySelector(".film-bg").style.backgroundImage = `url(/assets/IMAGES/FILMS/${film.image})`;


  // Affichage HTML :
  
  const filmInfo = document.querySelector(".info-content");
  filmInfo.innerHTML = `    
    <img class="logo" src="/assets/IMAGES/LOGO/logo-international-white 1.png" alt="">
    <img class="poster-medium" src="/assets/IMAGES/FILMS/${film.image}" alt="Affiche du film ${film.titre}">
    <h1>${film.titre}</h1>
    <a href="/pages/filmsList.html" class="tert-btn">Changer de film</a>
    <div class="seance-info">
      <div class="col-left">
        <p>Séance</p>
      </div>
      <div class="col-right">
        <p>${seance.horaire} ${langue}</p>
        <p>Fin prévue : ${horaireFin}</p>
      </div>
    </div>  
  `;
}
























