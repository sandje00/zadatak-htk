import { kittenAdoptedEvent } from './js/events.js';
import KittenCarousel from './js/kittenCarousel.js';
import KittenModal from './js/kittenModal.js';
import Kittens from './js/kittens.js';
import { updateKittenList } from './js/utils/dom.js';

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

let radioSortBy = document.querySelectorAll('input[type=radio][name="sort-by"]');
let currentSortBy = 'age';
radioSortBy.forEach(radio => {
    radio.checked = radio.value === currentSortBy;
    radio.addEventListener('change', e => onSortByValueChange(e));
});

let radioSortOrder = document.querySelectorAll('input[type=radio][name="sort-order"]');
let currentSortOrder = 'asc';
radioSortOrder.forEach(radio => {
    radio.checked = radio.value === currentSortOrder;
    radio.addEventListener('change', e => onSortOrderValueChange(e));
});

let checkboxFilter = document.querySelectorAll('input[type=checkbox]');
checkboxFilter.forEach(filter => filter.addEventListener('change', e => onFilterValueChange(e)));
    
function onSortByValueChange(e) {
    currentSortBy = e.target.value;
    updateKittenList(e.target, () => kittens.sortByKey(currentSortBy, currentSortOrder));
}
    
function onSortOrderValueChange(e) {
    currentSortOrder = e.target.value;
    updateKittenList(e.target, () => kittens.sortByKey(currentSortBy, currentSortOrder));
}
    
function onFilterValueChange(e) {
    if (e.target.checked) updateKittenList(e.target, () => kittens.filterByKey(e.target.name, e.target.value));
    else updateKittenList(e.target, () => kittens.removeFilter());
}
