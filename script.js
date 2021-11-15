import { kittenAdoptedEvent, kittensUpdatedEvent } from './js/events.js';
import { hide } from './js/utils/dom.js';
import KittenCarousel from './js/kittenCarousel.js';
import KittenModal from './js/kittenModal.js';
import Kittens from './js/kittens.js';

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

const carouselItems = kittens.getTopN(4, 'age');
const carouselElement = document.getElementById('kitten-carousel');
const isCarouselAnimated = true;
const carousel = new KittenCarousel(carouselItems, carouselElement, isCarouselAnimated, showKittenModal);
carousel.init();

document.addEventListener('kittens-updated', () => kittens.renderVisibleKittens());

document.addEventListener('kitten-adopted', e => {
    kittens.removeEntry(e.detail.kittenId);
    carousel.refreshContent(kittens.getTopN(4, 'age'));
});

let searchBox = document.getElementById('kitten-search-box');
searchBox.addEventListener('keyup', e => onSearch(e));

function onSearch(e) {
    let keyword = e.target.value.toUpperCase();
    updateKittenList(e.target, () => kittens.searchByKey('name', keyword))
    hide(showMoreButton);
}

const NUMBER_OF_ENTRIES = 4;
let visibleKittens = kittens.getTopN(NUMBER_OF_ENTRIES, 'age');
kittens.renderVisibleKittens(visibleKittens);

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

let showMoreButton = document.getElementById('show-more');
showMoreButton.addEventListener('click', onShowMore);
    
function onSortByValueChange(e) {
    currentSortBy = e.target.value;
    updateKittenList(e.target, () => kittens.sortByKey(currentSortBy, currentSortOrder))
    showMoreButton.classList.add('display-none');
}
    
function onSortOrderValueChange(e) {
    currentSortOrder = e.target.value;
    updateKittenList(e.target, () => kittens.sortByKey(currentSortBy, currentSortOrder))
    hide(showMoreButton);
}
    
function onFilterValueChange(e) {
    if (e.target.checked) updateKittenList(e.target, () => kittens.filterByKey(e.target.name, e.target.value));
    else updateKittenList(e.target, () => kittens.removeFilter());
    hide(showMoreButton);
}

function onShowMore() {
    updateKittenList(showMoreButton, () => kittens.visibleEntries);
    hide(showMoreButton);
}

function updateKittenList(element, updateAction) {
    kittensUpdatedEvent.detail.kittens = updateAction();
    element.dispatchEvent(kittensUpdatedEvent);
}
