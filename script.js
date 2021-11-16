import { kittenAdoptedEvent } from './js/events.js';
import KittenCarousel from './js/kittenCarousel.js';
import KittenModal from './js/kittenModal.js';
import Kittens from './js/kittenList.js';

async function loadJSON(path) {
    const data = await fetch(path);
    return data.json();
}

async function main() {
    const data = await loadJSON('/kittens.json');
    localStorage.setItem('kittens', JSON.stringify(data))
}

main();

const kittenModal = new KittenModal(document.getElementById('kitten-modal-0'), kittenAdoptedEvent);
kittenModal.init();

const showKittenModal = kitten => kittenModal.showModal(kitten);

const kittens = new Kittens(JSON.parse(localStorage.getItem('kittens')), showKittenModal);
kittens.init();

const NUMBER_OF_CAROUSEL_ITEMS = 4;
const carouselItems = kittens.getTopN(NUMBER_OF_CAROUSEL_ITEMS, 'age');
const carouselElement = document.getElementById('kitten-carousel');
const isCarouselAnimated = true;
const carousel = new KittenCarousel(carouselItems, carouselElement, isCarouselAnimated, showKittenModal);
carousel.init();

document.addEventListener('kittens-updated', e => kittens.renderVisibleKittens(e.detail.kittens) && (kittens.hideShowMoreButton())());

document.addEventListener('kitten-adopted', e => {
    kittens.removeEntry(e.detail.kittenId);
    carousel.refreshContent(kittens.getTopN(4, 'age'));
});
