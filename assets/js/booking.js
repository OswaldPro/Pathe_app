// Fichier point d'entrée : centralise les modules gauche et droite (steps)

import { initBookingLeft } from "./booking-left.js";
import { initBookingRight } from "./booking-right.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const seanceId = params.get("seance");

  if (!seanceId) {
    console.warn("Pas de séance sélectionnée → retour à la liste");
    window.location.href = "/pages/filmsList.html";
    return;
  }

  // Ex: seance=film2-seance3
  const [filmStr, seanceStr] = seanceId.split("-");
  const filmIndex = parseInt(filmStr.replace("film", ""));
  const seanceIndex = parseInt(seanceStr.replace("seance", ""));

  fetch("/data/JSON/films.json")
    .then(res => res.json())
    .then(data => {
      const film = data[filmIndex];
      if (!film) throw new Error("Film non trouvé");
      const seance = film.séances[seanceIndex];
      if (!seance) throw new Error("Séance non trouvée");

      // Affichage salle dans header
      const salleInfo = document.querySelector(".salle-nbr");
      salleInfo.innerHTML = `
      <p>Salle ${seance.salle}</p>
      <img class="handi-b" src="/assets/IMAGES/PICTOS/handicap-black.png" alt="">
      `;

      let horaireFin = seance.fin;
      let langue = seance.vf ? "VF" : (seance.vost ? "VOST" : "");

      // on appelle les 2 modules
      initBookingLeft(film, seance, horaireFin, langue);
      initBookingRight(film, seance);
    })
    .catch(err => console.error(err));
});
