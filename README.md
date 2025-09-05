# 🎬 Projet Pathé - Réservation en ligne

Ce projet simule le parcours de réservation d’un film dans un cinéma **Pathé**.  
Il a été développé dans le cadre d’un **examen pratique** et permet de passer de la sélection d’un film jusqu’à la confirmation de la réservation.

---

## 🚀 Fonctionnalités

- **Liste des films** avec filtres :
  - Genre, langue (VF/VOST), 4K, recherche par titre.
- **Séances** : affichage des horaires et options (IMAX, 4DX, accessibilité).
- **Réservation** : parcours en 5 étapes
  1. Choix des sièges (max 6, visuel interactif).
  2. Sélection des tarifs (adulte, matin, enfant).
  3. Ajout de snacks.
  4. Paiement (carte bancaire ou Google Pay).
  5. Confirmation avec QR code factice.
- **Breadcrumb dynamique** : mise à jour du chemin en fonction de l’avancement.

---

## 🖼️ Aperçu

_(screenshots à insérer ici : liste des films, sélection sièges, paiement, confirmation)_

---

## 🛠️ Technologies

- **HTML5 / CSS3** (mise en page responsive, animations).
- **JavaScript Vanilla (ES6)** :
  - Chargement des films depuis un fichier **JSON**.
  - DOM dynamique et gestion des étapes.
  - Objet `booking` pour suivre le film, la séance et les sièges sélectionnés.
  - Objet `cart` pour gérer les tarifs et le panier.

---

Projet réalisé dans le cadre d’un examen pratique de développement web.
Développé par Oswald
