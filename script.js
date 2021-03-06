import { extractNumberFromString } from './js/utils/string.js';
import { kittenAdoptedEvent } from './js/events.js';
import KittenCarousel from './js/kittenCarousel.js';
import KittenModal from './js/kittenModal.js';
import KittenPopup from './js/kittenPopup.js';
import Kittens from './js/kittenList.js';

async function loadJSON(path) {
    const data = await fetch(path);
    return data.json();
}

async function main() {
    const data = await loadJSON('/kittens.json');
    localStorage.setItem('kittens', JSON.stringify(data));
}

main();

const kittenPopup = new KittenPopup(document.getElementById('kitten-popup'));
kittenPopup.init();

const kittenModal = new KittenModal(document.getElementById('kitten-modal'), kittenAdoptedEvent, kittenPopup);
kittenModal.init();

const kittens = new Kittens(JSON.parse(localStorage.getItem('kittens')));
kittens.init();

const NUMBER_OF_CAROUSEL_ITEMS = 4;
const carouselItems = kittens.getTopN(NUMBER_OF_CAROUSEL_ITEMS, 'age');
const carouselElement = document.getElementById('kitten-carousel');
const isCarouselAnimated = true;
const carousel = new KittenCarousel(carouselItems, carouselElement, isCarouselAnimated);
carousel.init();

document.addEventListener('click', e => {
    if (e.target.closest('.card') || e.target.closest('.carousel-slide')) {
        const el = e.target.closest('.card') || e.target;
        const id = extractNumberFromString(el.id);
        kittenModal.showModal(kittens.findEntry(id));
    }
});

document.addEventListener('kittens-updated', e => kittens.renderVisibleKittens(e.detail.kittens) && (kittens.hideShowMoreButton())());

document.addEventListener('kitten-adopted', e => {
    kittens.removeEntry(e.detail.kittenId);
    carousel.refreshContent(kittens.getTopN(4, 'age'));
});
