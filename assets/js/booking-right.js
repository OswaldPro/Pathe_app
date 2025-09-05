// Objet global pour stocker la réservation en cours
let booking = {
  selectedSeats: [],
  film: null,
  seance: null
};
// Fonctions globales pour gere le panier et le total
// Créer une fonction pour le cart
function createCart(seance) {
  return {
    items: {
      tickets: {
        adult: 0,
        child: 0
      },
      snacks: []
    },
    prices: {
      tickets: {
        adult: 12.00,
        child: 6.50,
        morning: 9.90
      },
      snacks: {
        menus: [
          { id: 'menu1', name: 'Menu Classic', price: 8.90 },
          { id: 'menu2', name: 'Menu Duo', price: 14.90 },
          { id: 'menuXL', name: 'Menu XL', price: 20.50 }
        ],
        individuals: [
          { id: 'popcornS', name: 'Popcorn Small', price: 4.50 },
          { id: 'popcornM', name: 'Popcorn Medium', price: 6.20 },
          { id: 'popcornL', name: 'Popcorn Large', price: 7.20 },
          { id: 'snack1', name: 'M&Ms', price: 3.50 },
          { id: 'snack2', name: 'Haribo', price: 2.50 },
          { id: 'snack3', name: 'KitKat', price: 3.00 },
          { id: 'snack4', name: 'Mars', price: 2.50 }
        ],
        drinks: [
          { id: 'cola', name: 'Coca-Cola', price: 4.00 },
          { id: 'sprite', name: 'Sprite', price: 4.00 },
          { id: 'water', name: 'Eau', price: 2.00 },
          { id: 'coffee', name: 'Café', price: 2.50 }
        ]
      }
    },
    isMorningPrice() {
      let [h, m] = seance.horaire.split(":").map(Number);
      let totalMinutes = h * 60 + m;
      let isMorning = totalMinutes < 12 * 60;
      return {
        isMorning: isMorning,
        label: isMorning ? "Matin" : "Adulte"
      };
    },
    calculateTicketsTotal() {
      const { isMorning } = this.isMorningPrice();
      const adultPrice = isMorning ? this.prices.tickets.morning : this.prices.tickets.adult;
      const ticketsTotal = (this.items.tickets.adult * adultPrice) + 
                          (this.items.tickets.child * this.prices.tickets.child);
      return ticketsTotal.toFixed(2);
    },
    calculateSnacksTotal() {
      return this.items.snacks.reduce((total, snack) => {
        // Chercher le prix du snack dans toutes les catégories
        // ?. permet d'eviter les erreur si find ne trouve pas
        const snackPrice = 
        this.prices.snacks.menus.find(s => s.id === snack.id)?.price ||
        this.prices.snacks.individuals.find(s => s.id === snack.id)?.price ||
        this.prices.snacks.drinks.find(s => s.id === snack.id)?.price || 0;
        
        return total + (snack.quantity * snackPrice);
      }, 0).toFixed(2);
    },
    calculateTotal() {
      return (Number(this.calculateTicketsTotal()) + Number(this.calculateSnacksTotal())).toFixed(2);
    },
    updateDisplay() {
      // Récupérer le panier du step actuel
      const currentStep = document.querySelector('.step:not(.hidden)');
      if (!currentStep) return;

      // Cibler les éléments dans le step actuel uniquement
      const adultQty = currentStep.querySelectorAll(".adultQty");
      const childQty = currentStep.querySelectorAll(".childQty");
      const totalPrice = currentStep.querySelector(".totalPrice");
      const adultRow = currentStep.querySelector(".cart-item-adult");
      const childRow = currentStep.querySelector(".cart-item-child");
      const cartDetails = currentStep.querySelector(".cart-details");

      // Mise à jour des quantités
      if (adultQty) adultQty.forEach(el => el.textContent = this.items.tickets.adult);
      if (childQty) childQty.forEach(el => el.textContent = this.items.tickets.child);
      
      // Affichage conditionnel des lignes
      if (adultRow) adultRow.style.display = this.items.tickets.adult > 0 ? "flex" : "none";
      if (childRow) childRow.style.display = this.items.tickets.child > 0 ? "flex" : "none";
      
      const { label } = this.isMorningPrice();
      const adultLabel = document.querySelector(".adultLabel");
      if (adultLabel) adultLabel.textContent = label;


      // Maj de l'affichage pour les snacks
      if (cartDetails) {
        // On supprime les anciens snacks
        const existingSnacks = cartDetails.querySelectorAll(".cart-item-snack");
        existingSnacks.forEach(snack => snack.remove());

        // On injecte les nouveaux snacks
        this.items.snacks.forEach(snack => {
          // Trouver le prix du snack
          const snackPrice = 
            this.prices.snacks.menus.find(s => s.id === snack.id)?.price ||
            this.prices.snacks.individuals.find(s => s.id === snack.id)?.price ||
            this.prices.snacks.drinks.find(s => s.id === snack.id)?.price || 0;

          const snackRow = document.createElement("div");
          snackRow.classList.add("cart-item-snack");
          snackRow.innerHTML = `
            <span class="snackQty">${snack.quantity}</span> x 
            <span class="snackLabel">${snack.name}</span>
            <span class="totalSnack">${(snack.quantity * snackPrice).toFixed(2)}€</span>
          `;
          cartDetails.appendChild(snackRow); // Ajouter la ligne au panier
        });
      }

      // Mise à jour du total
      if (totalPrice) totalPrice.textContent = this.calculateTotal() + "€";
    }
  };
}

// Fonction de mise à jour du header et du breadcrumb
function updateHeader(step) {
  const breadcrumb = document.querySelector(".breadcrumb");
  if (!breadcrumb) return;

  // Labels des steps
  const stepsLabels = [
    "Sièges",
    "Tarifs",
    "Snacks",
    "Paiement",
    "Confirmation"
  ];

  // Base du breadcrumb
  let html = `
    <li class="breadcrumb-item"><a href="/index.html">Accueil</a></li>
    <li class="breadcrumb-item"><a href="/pages/filmsList.html">Choisir une séance</a></li>
  `;

  // Ajouter toutes les étapes jusqu’à l’étape courante incluse
  for (let i = 0; i <= step; i++) {
    const isCurrent = i === step;
    html += `
      <li class="breadcrumb-item"><a href="#" ${isCurrent ? ' aria-current="page"' : ""}>${stepsLabels[i]}</a>        
      </li>
    `;
  }

  breadcrumb.innerHTML = html;
}


export function initBookingRight(film, seance) {

  const cart = createCart(seance);
  
  // ----------------Fonctions complémentaires----------------
  
  // navigation entre steps
  let currentStep = 0;
  const steps = document.querySelectorAll(".step");


  function goToStep(n) {
    steps[currentStep].classList.add("hidden");
    steps[n].classList.remove("hidden");
    currentStep = n;

    updateHeader(n);

    switch (n) {
      case 0: initSeats(); break;
      case 1: initTarifs(); break;
      case 2: initSnacks(); break;
      case 3: initPayment(); break;
      case 4: initConfirmation(); break;
    }
  }

  // Mise à jour du bouton "Suivant" pour les sieges
  function updateNextButton() {
    const seatsContainer = document.getElementById("step-seats");
    const existingBtn = seatsContainer.querySelector('.next-btn-active, .next-btn-inactive');
    if (existingBtn) {
      existingBtn.remove(); // Supprimer l'ancien bouton s'il existe
    }

    const nextBtnStyle = booking.selectedSeats.length > 0 ? "next-btn-active" : "next-btn-inactive";
    const nextBtnContent = booking.selectedSeats.length > 0 ? "Réserver vos places" : "Veuillez choisir au moins une place";

    const nextBtn = document.createElement("div");
    nextBtn.classList.add(`${nextBtnStyle}`);
    nextBtn.innerHTML = `
      <p>${nextBtnContent}</p>
      <img src="/assets/IMAGES/PICTOS/fleche-droite.png" alt="">
    `;
    seatsContainer.appendChild(nextBtn);

    nextBtn.addEventListener("click", () => {
      if (booking.selectedSeats.length === 0) {
        alert("Veuillez sélectionner au moins une place");
        return;
      }

      
      goToStep(1);
    });
  }


  // Bouton retour
  const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            goToPreviousStep();
        });
    }

  function goToPreviousStep() {
    if (currentStep > 0) {
      steps[currentStep].classList.add("hidden");}
      currentStep--;
      steps[currentStep].classList.remove("hidden");
      updateHeader(currentStep);
  }

  // Mise à jour du récapitulatif
  function updateRecap() {
    const recap = document.querySelector(".recap");
    if (recap) {
      recap.innerHTML = `<p>${booking.selectedSeats.length} place(s) réservée(s) : ${booking.selectedSeats.join(", ")}</p>`;
    }
    updateNextButton(); // Ajouter ici pour mettre à jour le bouton
  }

  // ----------------Initialisation des steps----------------


  // Step 0 : Sélection des sièges
  function initSeats( reservedSeats = []) {
    const freeSeatsNb = seance.libres;
    const rows = 15;
    const cols = 20;
    const totalGridSeats = rows * cols;
    const seatCount = totalGridSeats - freeSeatsNb;

    function generateRandomUnavailableSeats() {
      const unavailableSeats = new Set();
      while (unavailableSeats.size < seatCount) {
        const randomRow = Math.floor(Math.random() * rows) + 1;
        const randomCol = Math.floor(Math.random() * cols) + 1;
        const seatId = `${randomRow}-${randomCol}`;
        unavailableSeats.add(seatId);
      }
      return Array.from(unavailableSeats);
    }

    const seatsContainer = document.getElementById("step-seats");
    seatsContainer.innerHTML = "";

    // titre
    const titleSeatContainer = document.createElement("div");
    titleSeatContainer.classList.add("title-seat-container");
    titleSeatContainer.innerHTML = `
      <h2>Sélectionnez vos sièges</h2>
      <div class="free-seats-nb">${freeSeatsNb} places libres</div>
    `;
    seatsContainer.appendChild(titleSeatContainer);

    // grille
    const seatsSelectionWrapper = document.createElement("div");
    seatsSelectionWrapper.classList.add("seats-selection-wrapper");

    const unavailableSeats = generateRandomUnavailableSeats();

    for (let row = 0; row < rows; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      for (let col = 0; col < cols; col++) {
        const seatId = `${row + 1}-${col + 1}`; // Pour la logique interne
        const displayId = `${String.fromCharCode(65 + row)}${col + 1}`; // Pour l'affichage (A1, B2, etc.)
        const seat = document.createElement("img");

        if (reservedSeats.includes(seatId) || unavailableSeats.includes(seatId)) {
          seat.src = "/assets/IMAGES/PICTOS/siege-gris.png";
          seat.classList.add("seat", "reserved");
        } else {
          seat.src = "/assets/IMAGES/PICTOS/siege-jaune.png";
          seat.classList.add("seat", "free");
        }

        seat.dataset.id = seatId;
        seat.dataset.displayId = displayId; // Stocke aussi l'ID d'affichage

        //Affichage siege PMR (place 7 à 14 de la rangee 1)
        if (row === 0 && col >= 6 && col <= 13) {
          seat.src = "/assets/IMAGES/PICTOS/seatPMR.png";
          seat.classList.add("seat", "PMR");
          seat.classList.remove("free");
          seat.style.cursor = "not-allowed"; // Change le curseur pour indiquer que ce n'est pas cliquable
        }

        // clic sur siège
        seat.addEventListener("click", () => {
          const MAX_SEATS = 6;
          if (seat.classList.contains("free")) {
            if (booking.selectedSeats.length >= MAX_SEATS) {
              alert(`Vous ne pouvez pas sélectionner plus de ${MAX_SEATS} sièges`);
              return;
            }
            seat.classList.replace("free", "selected");
            seat.src = "/assets/IMAGES/PICTOS/siege-vert.png";
            booking.selectedSeats.push(displayId);
            updateRecap();
          } else if (seat.classList.contains("selected")) {
            seat.classList.replace("selected", "free");
            seat.src = "/assets/IMAGES/PICTOS/siege-jaune.png";
            booking.selectedSeats = booking.selectedSeats.filter(s => s !== displayId); 
            updateRecap();
          }
        });

        rowDiv.appendChild(seat);
      }
      seatsSelectionWrapper.appendChild(rowDiv);
    }
    seatsContainer.appendChild(seatsSelectionWrapper);

    // screen-banner
    const screenBanner = document.createElement("div");
    screenBanner.classList.add("screen-banner");
    screenBanner.innerHTML = `
      <div class="screen-left"></div>
      <span>Écran</span>
      <div class="screen-right"></div>
    `;
    seatsContainer.appendChild(screenBanner);

    // légende + recap  
    const bottomSeat = document.createElement("div");
    bottomSeat.classList.add("bottom-seat");
    bottomSeat.innerHTML = `
      <div class="legends">
        <div class="legend-item"><img src="/assets/IMAGES/PICTOS/siege-vert.png" alt=""><p>Mes places</p></div>
        <div class="legend-item"><img src="/assets/IMAGES/PICTOS/siege-jaune.png" alt=""><p>Places libres</p></div>
        <div class="legend-item"><img src="/assets/IMAGES/PICTOS/siege-gris.png" alt=""><p>Places indisponibles</p></div>
      </div>
      <div class="recap ">
        <p>${booking.selectedSeats.length} place(s) réservée(s) : ${booking.selectedSeats.join(", ")}</p>
      </div>
    `;
    seatsContainer.appendChild(bottomSeat);

    updateNextButton();
  }

  // Step 1 : Tarifs
  function initTarifs() {
    const stepTarifs = document.getElementById("step-tarifs");
    if (!stepTarifs) return;

    // Initialisation des quantités
    cart.items.tickets.adult = booking.selectedSeats.length;
    cart.items.tickets.child = 0;


    // Affiche complet :
    stepTarifs.innerHTML = `

    <h2>Selectionnez vos tarifs (${booking.selectedSeats.length})</h2>

    <div class="tarifs-container">
      <div class="pass">
        <img class="cine-pass" src="/assets/IMAGES/PICTOS/cine-pass.png" alt="">
        <p>Ajouter votre CinéPass ou code promo...</p>
        <a class="secondary-btn">Ajouter</a>
      </div>

      <div class="tarifs">
        <div class="tarif-adulte">
          <p>${cart.isMorningPrice().label}</p>
          <div class="ligneA"></div>
          <div>
            <img id="minusA" class="plus-minus" src="/assets/IMAGES/PICTOS/bouton-moins.png" alt="">
            <span class="adultQty">${cart.items.tickets.adult}</span>
            <img id="plusA" class="plus-minus" src="/assets/IMAGES/PICTOS/bouton-plus.png" alt="">
            </div>
        </div>

        <div class="tarif-enfant">
          <p>Moins de 12 ans</p>
          <div class="ligneC"></div>
          <div>
            <img id="minusC" class="plus-minus" src="/assets/IMAGES/PICTOS/bouton-moins.png" alt="">
            <span class="childQty">${cart.items.tickets.child}</span>
            <img id="plusC" class="plus-minus" src="/assets/IMAGES/PICTOS/bouton-plus.png" alt="">
          </div>
        </div>
      </div>
    </div>

    <a id="backButton" class="tert-btn-dark">Modifiez vos places</a>

    <div class="cart">
      <h3>Mon panier</h3>
      <div class="cart-details">
        <div class="cart-item-adult">
          <span class="adultQty">0</span> x <span class="adultLabel">Adulte</span>
          <span class="totalAdult"></span>
        </div>

        <div class="cart-item-child">
          <span class="childQty">0</span> x <span class="childLabel">Moins de 12 ans</span>
          <span class="totalChild"></span>
        </div>
      </div>
    </div>

    <div class="bottom-banner">
      <div class="total-container">
        <p>Total à regler</p>
        <span class="totalPrice">${cart.calculateTotal()}€</span>
      </div>            
      <div id="goNextStep" >
      </div>
    </div>
    `;

    // Mise à jour du bouton "Suivant" 
  function updateSecNextBtn() {
    const secNextBtn = document.getElementById("goNextStep");
    if (!secNextBtn) return;

    // Vérifier le nombre total de places et de tarifs
    const totalTarifs = cart.items.tickets.adult + cart.items.tickets.child;
    const isComplete = booking.selectedSeats.length === totalTarifs;

    // Réinitialiser les classes
    secNextBtn.classList.remove("sec-next-btn-active", "sec-next-btn-inactive");
    
    // Ajouter la classe appropriée
    secNextBtn.classList.add(isComplete ? "sec-next-btn-active" : "sec-next-btn-inactive");

    // Mettre à jour le contenu
    secNextBtn.innerHTML = `
        <p>${isComplete ? "Continuer" : "Veuillez choisir les tarifs pour vos places"}</p>
        ${isComplete ? '<img src="/assets/IMAGES/PICTOS/fleche-droite.png" alt="">' : ''}
    `;

    // Supprimer l'ancien event listener
    const oldSecNextBtn = secNextBtn.cloneNode(true);
    secNextBtn.parentNode.replaceChild(oldSecNextBtn, secNextBtn);

    // Ajouter le nouveau event listener uniquement si complet
    if (isComplete) {
        oldSecNextBtn.addEventListener("click", () => {
            goToStep(2);
        });
    }
  }

    // affichage tarifs selon age limite du film
    if (film.âge_minimum >= 12) { 
      document.querySelector(".tarif-enfant").style.display = "none";
    }
    
    // Event Listeners
      // Boutons adulte
    const plusAdult = document.getElementById("plusA");
    const minusAdult = document.getElementById("minusA");
    const plusChild = document.getElementById("plusC");
    const minusChild = document.getElementById("minusC");

    if (plusAdult) {
        plusAdult.addEventListener("click", () => {
            const total = cart.items.tickets.adult + cart.items.tickets.child;
            if (total < booking.selectedSeats.length) {
                cart.items.tickets.adult++;
                cart.updateDisplay();
                updateSecNextBtn();
            }
        });
    }

    if (minusAdult) {
        minusAdult.addEventListener("click", () => {
            if (cart.items.tickets.adult > 0) {
                cart.items.tickets.adult--;
                cart.updateDisplay();
                updateSecNextBtn();
            }
        });
    }

    if (plusChild) {
        plusChild.addEventListener("click", () => {
            const total = cart.items.tickets.adult + cart.items.tickets.child;
            if (total < booking.selectedSeats.length) {
                cart.items.tickets.child++;
                cart.updateDisplay();
                updateSecNextBtn();
            }
        });
    }

    if (minusChild) {
        minusChild.addEventListener("click", () => {
            if (cart.items.tickets.child > 0) {
                cart.items.tickets.child--;
                cart.updateDisplay();
                updateSecNextBtn();
            }
        });
    }

    //Calcul initial
    cart.updateDisplay();
    updateSecNextBtn();
  };

  //Step 2 : Snacks
  function initSnacks() {  
    // Init du cart
    cart.updateDisplay();

    const adultPrice = cart.isMorningPrice().isMorning ? cart.prices.tickets.morning : cart.prices.tickets.adult;

    
    const stepSnacks = document.getElementById("step-snacks");
    if (!stepSnacks) return;

    stepSnacks.innerHTML =`
    <h2>Profitez encore plus de votre scéance</h2>
    <div class="snacks-container">
      <h3>Formules</h3>
      <div class="menus"></div>
      <h3>Pop-Corn et sucreries</h3>
      <div class="individuals"></div>
      <h3>Boissons</h3>
      <div class="drinks"></div>
    </div>

    <div class="cart">
      <h3>Mon panier</h3>
      <div class="cart-details">
        <!-- Tickets -->
        <div class="cart-item-adult">
          <span class="adultQty">${cart.items.tickets.adult}</span> x 
          <span class="adultLabel">${cart.isMorningPrice().label}</span>
          <span class="totalAdult">${(cart.items.tickets.adult * adultPrice).toFixed(2)}€</span>
        </div>
        <div class="cart-item-child">
          <span class="childQty">${cart.items.tickets.child}</span> x 
          <span class="childLabel">Moins de 12 ans</span>
          <span class="totalChild">${(cart.items.tickets.child * cart.prices.tickets.child).toFixed(2)}€</span>
        </div>
        <!-- Les snacks seront injectés ici -->
      </div>
      
      <div class="bottom-banner">
        <div class="total-container">
          <p>Total à régler</p>
          <span class="totalPrice">${cart.calculateTotal()}€</span>
        </div>
        <div id="goNextStep" class="sec-next-btn-active">
          <p>Continuer</p>
          <img src="/assets/IMAGES/PICTOS/fleche-droite.png" alt="">
        </div>
      </div>
    </div>
`;


    // fonction de creation des cards pour les snacks (generale) :
    function createSnackCard (category) {
      cart.prices.snacks[category].forEach( s => {
        const snackId = s.id;
        const snackName = s.name;
        const snackPrice = s.price;

        const card = document.createElement("div");
        card.classList.add("snack-card");
        card.innerHTML = `
        <img src="/assets/IMAGES/SNACKS/${snackId}.png" alt="">
        <p class="snack-name" data-id="${snackId}">${snackName}</p>
        <div class="price-container">
          <p class="snack-price">${snackPrice.toFixed(2)}€</p>
          <div class="selector">
            <img id="minus" src="/assets/IMAGES/PICTOS/bouton-moins.png" alt="">
            <span class="snack-Qty"></span>
            <img id="plus" src="/assets/IMAGES/PICTOS/bouton-plus.png" alt="">
          </div>
        </div>   
        `;

        document.querySelector(`.${category}`).appendChild(card);
      })
    };

    createSnackCard("menus");
    createSnackCard("individuals");
    createSnackCard("drinks");

    // Mettre à jour l'affichage initial du panier
    cart.updateDisplay();


    // Ajouter/retirer un snack au panier
    function updateSnack(snackId, snackName, quantity) {
        const existingSnack = cart.items.snacks.find(snack => snack.id === snackId);

        if (existingSnack) {
            existingSnack.quantity += quantity;
            // Supprimer le snack si la quantité atteint 0
            if (existingSnack.quantity <= 0) {
                cart.items.snacks = cart.items.snacks.filter(snack => snack.id !== snackId);
            }
        } else if (quantity > 0) {
            // Ajouter uniquement si la quantité est positive
            cart.items.snacks.push({ id: snackId, name: snackName, quantity: quantity });
        }
        cart.updateDisplay();
    }

    
    //Event listeners
    //Bouton plus et moins
    const snackCards = document.querySelectorAll(".snack-card");
    snackCards.forEach(card => {
      const plusBtn = card.querySelector("#plus");
      const minusBtn = card.querySelector("#minus");
      const qtyDisplay = card.querySelector(".snack-Qty");
      const snackId = card.querySelector(".snack-name").dataset.id;
      const snackName = card.querySelector(".snack-name").textContent;
      let quantity = 0;
      qtyDisplay.textContent = quantity;

      plusBtn.addEventListener("click", () => {
        quantity++;
        qtyDisplay.textContent = quantity;
        updateSnack(snackId, snackName, 1);
      });

      minusBtn.addEventListener("click", () => {
        if (quantity > 0) {
            quantity--;
            qtyDisplay.textContent = quantity;
            updateSnack(snackId, snackName, -1);
        }
      });
    });

    //Bouton continuer 
    const currentStep = document.querySelector('.step:not(.hidden)'); // permet de cibler le step actuel et de na pas selectionner les element des step precedent
    const nextBtn = currentStep.querySelector("#goNextStep");

    nextBtn.addEventListener("click", () => {
        goToStep(3);
    }); 
  }
  // Step 3 : Paiement
  function initPayment() {
    // Variables necessaires : total a regler

    // Affichage HTML 
    const stepPayment = document.getElementById("step-payment");
    if (!stepPayment) return;

    stepPayment.innerHTML =`
    <h2>Paiement sécurisé</h2>

    <div class="payment-container">
      <h3>Choisir mon mode de paiement</h3>

      <!-- Carte bancaire -->
      <div class="payment-method active" id="card-payment">
        <div class="payment-header">
          <span>Carte bancaire</span>
          <img src="/assets/IMAGES/PICTOS/cards.png" alt="CB, Visa, Mastercard, Amex">
        </div>

        <form class="card-form">
          <div class="form-group">
            <label for="cardNumber">Numéro de carte</label>
            <input type="text" id="cardNumber" placeholder="1234 5678 8765 5321" maxlength="19">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="expiryDate">Date d'expiration</label>
              <input type="text" id="expiryDate" placeholder="MM/AA" maxlength="5">
            </div>
            <div class="form-group">
              <label for="cvc">Cryptogramme</label>
              <input type="text" id="cvc" placeholder="123" maxlength="3">
            </div>
          </div>
        </form>
      </div>

      <!-- Google Pay -->
      <div class="payment-method" id="gpay-payment">
        <span>Google Pay</span>
        <img src="/assets/IMAGES/PICTOS/google-pay.png" alt="Google Pay">
      </div>
    </div>

    <div class="bottom-banner">
      <div class="total-container">
        <p>Total à régler</p>
        <span class="totalPrice">${cart.calculateTotal()}€</span>
      </div>
      <div id="goNextStep" class="sec-next-btn-active">
        <p>Continuer</p>
        <img src="/assets/IMAGES/PICTOS/fleche-droite.png" alt="">
      </div>
    </div>
    `;

      // Accoréon pour les methode de paiment : 
    const cardPayment = document.getElementById("card-payment");
    const gpayPayment = document.getElementById("gpay-payment");
    const cardForm = cardPayment.querySelector(".card-form");

    // Par défaut : Carte bancaire ouverte
    cardPayment.classList.add("active");
    cardForm.style.display = "block";

    // Fonction pour gérer l'accordéon
    function togglePayment(selected) {
      if (selected === "card") {
        cardPayment.classList.add("active");
        gpayPayment.classList.remove("active");
        cardForm.style.display = "block";
      } else if (selected === "gpay") {
        gpayPayment.classList.add("active");
        cardPayment.classList.remove("active");
        cardForm.style.display = "none";
      }
    }

    // Écouteurs de clic
    cardPayment.addEventListener("click", () => togglePayment("card"));
    gpayPayment.addEventListener("click", () => togglePayment("gpay"));  

    // Bouton suivant
    const currentStepCtn = document.querySelector('.step:not(.hidden)');
    const nextBtn = currentStepCtn.querySelector("#goNextStep");

    nextBtn.addEventListener("click", () => {
    goToStep(4);
    });
   }


  // Step 4 : Confirmation
function initConfirmation() {

  //Changement du header : suppression du breadcrumb - backButton : "retour" devient "Acceuil" et mene a index.html
  const breadcrumb = document.querySelector(".breadcrumb");
  if (breadcrumb) breadcrumb.innerHTML = "";

  const salleHeader = document.querySelector(".salle");
  if (salleHeader) salleHeader.innerHTML = "";

  const backBtn = document.getElementById("backButton");
  if (backBtn) {
    backBtn.textContent = "Accueil";
    backBtn.href = "/index.html";
    backBtn.removeEventListener("click", goToPreviousStep);
  }

  const stepConfirmation = document.getElementById("step-recap");
  if (!stepConfirmation) return;

  // Récup des infos depuis booking et cart
  const selectedSeats = booking.selectedSeats;
  const totalPrice = cart.calculateTotal();
  let langue = seance.vf ? "VF" : (seance.vost ? "VOST" : "")

  stepConfirmation.innerHTML = `
  <div class="recap-wrapper">
    <h2>Merci pour votre réservation</h2>
    <div class="recap-container">      
      <div class="recap-content">
        <p><strong>Pathé Lyon Bellecour</strong></p>
        <p class="title">${film.titre}</p>
        <p>Séance ${seance.horaire} ${langue}</p>
        <p>Salle ${seance.salle}</p>
        <p>Siège(s) : ${selectedSeats.length > 0 ? selectedSeats.join(", ") : "Non attribués"}</p>
        <p><strong>Total : ${totalPrice} €</strong></p>
      </div>
      <div class="qr-container">
        <img src="/assets/IMAGES/PICTOS/qr-code.png" alt="QR Code billet">
      </div>      
    </div>
    <div class="thanks">
      <p>L’équipe de votre cinémas Pathé vous souhaites une bonne séance !</p>
    </div>
  </div>
  `;
}
 

  // démarage au step 0
  goToStep(0);
}

