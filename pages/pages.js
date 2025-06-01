import { navbarComponent } from "../components/navbar.js";
import { cardComponent } from "../components/card.js";

let navContainer = document.querySelector('header');
let cardContainers = document.querySelectorAll('.cardContainer');

window.addEventListener('load', () => {
    navContainer.innerHTML = navbarComponent

    cardContainers.forEach(container => {
        container.innerHTML = cardComponent
    })
})
