import { navbarComponent } from "./components/navbarIndex.js";
import { cardComponent } from "./components/cardIndex.js";

let navContainer = document.querySelector('header');
let cardContainers = document.querySelectorAll('.cardContainer');

window.addEventListener('load', () => {
    navContainer.innerHTML = navbarComponent

    cardContainers.forEach(container => {
        container.innerHTML = cardComponent
    })
})
