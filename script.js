import Carousel from './js/carousel.js';
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

const carousel = new Carousel(
    kittens.getTopN(4, 'age'),
    document.getElementById('kitten-carousel'),
    'kitten'
);

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
        <div class="container">
            <h4>${kitten.name}</h4>
            <span>Starost: ${kitten.age}</span>
            <span>Boja: ${kitten.color}</span>
        </div>
    `;
    return kittenCard;
}

function removeKittenCard(id) {
    let kittenCard = document.getElementById(`kitten-${id}`);
    kittenCard.remove();
}

function onCardClick(e) {
    let kittenCard = e.target.closest('.kitten-search-card');
    let id = parseInt(kittenCard.id.slice(-1));
    showModal({ id, ...kittens.entries[id] });
}

function hideShowMoreButton() {
    showMoreButton.classList.add('display-none');
}

/* Modal logic */

let modal = document.getElementById('kitten-modal');
let modalContent = modal.querySelectorAll('.modal-content')[0];

let closeModalElements = modal.querySelectorAll('.modal-close');
closeModalElements.forEach(el => el.addEventListener('click', onCloseModal));

let adoptButton = modal.querySelectorAll('.modal-button')[0];
adoptButton.addEventListener('click', onAdoptButtonClick);

function onCloseModal() {
    let id = parseInt(modal.classList[1].slice(-1));
    closeModal(id);
}

function onAdoptButtonClick() {
    let id = parseInt(modal.classList[1].slice(-1));
    let result = confirm(`Jeste li sigurni da zelite udomiti macica po imenu ${kittens.entries[id].name}?`);
    if (result) adoptKitten(id);
}

function showModal(kitten) {
    let kittenInfo = createKittenInfoElement(kitten);
    modalContent.insertBefore(kittenInfo, modalContent.firstChild);
    toggleMultipleClasses(modal, `modal-${kitten.id}`, 'display-none');
}

function adoptKitten(id) {
    removeKittenCard(id);
    closeModal(id);
}

function closeModal(id) {
    modalContent.removeChild(modalContent.firstChild);
    toggleMultipleClasses(modal, `modal-${id}`, 'display-none');
}

function createKittenInfoElement(kitten) {
    let kittenInfo = `
        <img src="${kitten.image}" alt="${kitten.name}">
        <h4>${kitten.name}</h4>
        <span>Starost: ${kitten.age}</span>
        <span>Boja: ${kitten.color}</span>
    `;
    let kittenInfoContainer = document.createElement('div');
    kittenInfoContainer.classList.add('kitten-info');
    kittenInfoContainer.innerHTML = kittenInfo;
    return kittenInfoContainer;
}

function toggleMultipleClasses(el, ...classes) {
    classes.forEach(className => el.classList.toggle(className));
}
