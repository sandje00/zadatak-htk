import KittenCarousel from './js/kittenCarousel.js';
import KittenModal from './js/kittenModal.js';
import Kittens from './js/kittens.js';

/* Fetch data */

async function loadJSON(path) {
    const data = await fetch(path);
    return data.json();
}

async function main() {
    const data = await loadJSON('/kittens.json');
    localStorage.setItem('kittens', JSON.stringify(data))
}

main();

const kittens = new Kittens(JSON.parse(localStorage.getItem('kittens')));

const kittenModal = new KittenModal(document.getElementById('kitten-modal-0'));
kittenModal.init();

const carouselItems = kittens.getTopN(4, 'age');
const carouselElement = document.getElementById('kitten-carousel');
const isCarouselAnimated = true;
const carouselAction = kitten => kittenModal.showModal(kitten);
const carousel = new KittenCarousel(carouselItems, carouselElement, isCarouselAnimated, carouselAction);
carousel.init();

/* Search dashboard logic */

let searchBox = document.getElementById('kitten-search-box');
searchBox.addEventListener('keyup', e => onSearch(e));

function onSearch(e) {
    let keyword = e.target.value.toUpperCase();
    renderVisibleKittens(kittens.searchByKey('name', keyword));
    hideShowMoreButton();
}

const NUMBER_OF_ENTRIES = 4;
let visibleKittensInitial = kittens.getTopN(NUMBER_OF_ENTRIES, 'age');
renderVisibleKittens(visibleKittensInitial);

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
    renderVisibleKittens(kittens.sortByKey(currentSortBy, currentSortOrder));
    showMoreButton.classList.add('display-none');
}
    
function onSortOrderValueChange(e) {
    currentSortOrder = e.target.value;
    renderVisibleKittens(kittens.sortByKey(currentSortBy, currentSortOrder));
    hideShowMoreButton();
}
    
function onFilterValueChange(e) {
    if (e.target.checked) renderVisibleKittens(kittens.filterByKey(e.target.name, e.target.value));
    else renderVisibleKittens(kittens.removeFilter());
    hideShowMoreButton();
}

function onShowMore() {
    hideShowMoreButton();
    renderVisibleKittens(kittens.visibleEntries);
}

function renderVisibleKittens(visibleKittens) {
    let searchList = document.getElementById('kitten-search-list');
    if (searchList.hasChildNodes()) searchList.innerHTML = '';
    visibleKittens.forEach(kitten => {
        let el = createKittenCard(kitten);
        searchList.appendChild(el);
    });
}

function createKittenCard(kitten) {
    let id = kittens.entries.indexOf(kitten);
    let kittenCard = document.createElement('div');
    kittenCard.id = `kitten-${id}`;
    kittenCard.classList.add('kitten-search-card');
    kittenCard.addEventListener('click', e => onCardClick(e));
    kittenCard.innerHTML = `
        <img src="${kitten.image}" alt="${kitten.name}">
        <div class="container flex-v align-left">
            <h4>${kitten.name}</h4>
            <span>Starost: ${kitten.age}</span>
            <span>Boja: ${kitten.color}</span>
        </div>
    `;
    return kittenCard;
}

function onCardClick(e) {
    let kittenCard = e.target.closest('.kitten-search-card');
    let id = parseInt(kittenCard.id.slice(-1));
    kittenModal.showModal({ id, ...kittens.entries[id] });
}

function hideShowMoreButton() {
    showMoreButton.classList.add('display-none');
}
