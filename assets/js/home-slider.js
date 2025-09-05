document.addEventListener("DOMContentLoaded", () => { // on lance le js au chargement du DOM

  // Selecteurs
  let slider = document.getElementById("heroWrapper")

  //Tableau des slides 
  const slides = [
    "assets/IMAGES/SLIDES/nobody-2-slider-2.jpg",
    "assets/IMAGES/SLIDES/the-naked-gun-slider.png",
    "assets/IMAGES/SLIDES/evanouis-slider.webp",
    "assets/IMAGES/SLIDES/le-monde-de-wishy-2-slider.jpg",
    "assets/IMAGES/SLIDES/nobody-2-slider.jpg",
    "assets/IMAGES/SLIDES/karate-kid-legends-slider-2.webp",
    "assets/IMAGES/SLIDES/the-naked-gun-slider.png",
    "assets/IMAGES/SLIDES/evanouis-slider-2.webp",
  ];

  let index = 0;
  const heroWrapper = document.getElementById("heroWrapper");

  //Fonction pour changer le bg
  function changeBackground() {
          heroWrapper.style.backgroundImage = `url(${slides[index]})`;
          index = (index + 1) % slides.length; // boucle infinie : ex a index = 0 alors on fait 0 +1 % 9 = 1, si index =1 alors  1+ 1 = 2, et 2 % 9 = 2 etc... 
        } 

  // On set un petit delay d'une seconde
  setTimeout(() => {
    changeBackground(); // on lance la fonction de changement de bg
    setInterval(changeBackground, 5000); // ensuite toutes les 4s on change
  }, 500);



























});
