import CarouselController from './js/carouselController.js';
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


/* Carousel logic */

const carouselController = new CarouselController(kittens.getTopN(4, 'age'));

loadCarousel(carouselController.getCurrentItem());

let arrows = document.querySelectorAll('.kitten-carousel-icon');
arrows.forEach(arrow => arrow.addEventListener('click', e => onArrowClick(e)));

function onArrowClick(e) {
    const arrow = e.target;
    if (arrow.classList.contains('right'))
        loadCarousel(carouselController.moveRight());
    if (arrow.classList.contains('left'))
        loadCarousel(carouselController.moveLeft());
}

function loadCarousel(currentItem) {
    let carouselSlide = document.getElementById('slide');
    carouselSlide.innerHTML = '';
    carouselSlide.innerHTML += createCarouselSlide(currentItem);
}

function createCarouselSlide(item) {
    return `<img src=${item.image} alt=${item.alt}>`;
}


/* Search dashboard logic */

let searchBox = document.getElementById('kitten-search-box');
searchBox.addEventListener('keyup', e => onSearch(e));

function onSearch(e) {
    let keyword = e.target.value.toUpperCase();
    renderVisibleKittens(kittens.searchByKey('name', keyword));
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
    
function onSortByValueChange(e) {
    currentSortBy = e.target.value;
    renderVisibleKittens(kittens.sortByKey(currentSortBy, currentSortOrder));
}
    
function onSortOrderValueChange(e) {
    currentSortOrder = e.target.value;
    renderVisibleKittens(kittens.sortByKey(currentSortBy, currentSortOrder));
}
    
function onFilterValueChange(e) {
    if (e.target.checked)
        renderVisibleKittens(kittens.filterByKey(e.target.name, e.target.value));
    else
        renderVisibleKittens(kittens.removeFilter());
}

function renderVisibleKittens(visibleKittens) {
    let searchList = document.getElementById('kitten-search-list');
    if (searchList.hasChildNodes()) searchList.innerHTML = '';
    visibleKittens.forEach(kitten => {
        let el = createKittenCard(kitten);
        searchList.innerHTML += el;
    });
}

function createKittenCard(kitten) {
    let id = kittens.entries.indexOf(kitten);
    return `
        <div id="kitten-${id}" class="kitten-search-card">
            <img src="${kitten.image}" alt="${kitten.name}" class="image">
            <div class="container">
                <h4>${kitten.name}</h4>
                <span>Starost: ${kitten.age}</span>
                <span>Boja: ${kitten.color}</span>
            </div>
        </div>
    `;
}


/* Modal logic */

let kittenCards = document.querySelectorAll('.kitten-search-card');
kittenCards.forEach(card => card.addEventListener('click', e => onCardClick(e)));

function onCardClick(e) {
    let kittenCard = e.target.closest('.kitten-search-card');
    let id = parseInt(kittenCard.id.slice(-1));
    showModal(kittens.entries[id]);
}

function showModal(kitten) {
    let kittenInfo = createKittenInfoElement(kitten);
    let modal = document.getElementById('kitten-modal');
    let modalContent = modal.querySelectorAll('.modal-content')[0];
    modalContent.insertBefore(kittenInfo, modalContent.firstChild);
    modal.classList.toggle('display-none');
}

function createKittenInfoElement(kitten) {
    let kittenInfo = `
        <h4>${kitten.name}</h4>
        <span>Starost: ${kitten.age}</span>
        <span>Boja: ${kitten.color}</span>
    `;
    let kittenInfoContainer = document.createElement('div');
    kittenInfoContainer.classList.add('container');
    kittenInfoContainer.innerHTML = kittenInfo;
    return kittenInfoContainer;
}

let closeButton = document.querySelectorAll('.modal-close')[0];
closeButton.addEventListener('click', onCloseModal);

function onCloseModal() {
    let modal = document.getElementById('kitten-modal');
    let modalContent = modal.querySelectorAll('.modal-content')[0];
    modalContent.removeChild(modalContent.firstChild);
    modal.classList.toggle('display-none');
}
