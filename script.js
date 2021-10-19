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
    
let youngestFour = kittens.getTopN(4, 'age');
    
let carouselSlide = document.getElementById('slide');
let initImg = document.createElement('img');
initImg.src = youngestFour[0].image;
initImg.alt = youngestFour[0].alt;
carouselSlide.appendChild(initImg);
    
let arrowLeft = document.getElementById('left');
let arrowRight = document.getElementById('right');
    
let ctr = 1;
    
arrowRight.addEventListener('click', function () {
    if (ctr == youngestFour.length) ctr = 0;
    let carouselSlide = document.getElementById('slide');
    let img = carouselSlide.children[0];
    img.src = youngestFour[ctr].image;
    img.alt = youngestFour[ctr].name;
    ctr = ctr + 1;
});
    
arrowLeft.addEventListener('click', function () {
    ctr = ctr - 1;
    if (ctr == -1) ctr = youngestFour.length - 1;
    let carouselSlide = document.getElementById('slide');
    let img = carouselSlide.children[0];
    img.src = youngestFour[ctr].image;
    img.alt = youngestFour[ctr].name;
});
    

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

function renderVisibleKittens(visibleKittens) {
    let searchList = document.getElementById('kitten-search-list');
    if (searchList.hasChildNodes()) searchList.innerHTML = '';
    visibleKittens.forEach(kitten => {
        let el = createKittenCard(kitten);
        searchList.innerHTML += el;
    });
}

function createKittenCard(kitten) {
    return `
        <div class="kitten-search-card">
            <img src="${kitten.image}" alt="${kitten.name}" class="image">
            <div class="container">
                <h4><b>${kitten.name}</b></h4>
                <span>Starost: ${kitten.age}</span>
                <span>Boja: ${kitten.color}</span>
            </div>
        </div>
        `;
}
    
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
    