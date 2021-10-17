class Kittens {
    constructor(entries) {
        this.entries = entries;
        this.visibleEntries = this.sortByKey('age', 'asc');
    }
    
    sortByKey(key, order) {
        const isAscending = order === 'asc' || !(order === 'desc');
        if (key == 'age') return this._sortByAge(isAscending);
        if (key == 'name') return this._sortByName(isAscending);
    }

    getTopN(n, key) {
        const sorted = this.sortByKey(key);
        return n <= sorted.length && sorted.slice(0, n);
    }

    filterByKey(key, value) {
        if (key === 'age') this.visibleEntries = this._filterByAge(value);
        if (key === 'color') this.visibleEntries = this._filterByColor(value);

        return this.visibleEntries;
    }
    
    _sortByAge(isAscending) {
        return this.entries.slice().sort((a, b) => {
            return isAscending ? a.age - b.age : b.age - a.age;
        });
    }

    _sortByName(isAscending) {
        return this.entries.slice().sort((a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) return isAscending ? -1 : 1;
            if (nameA > nameB) return isAscending ? 1 : -1;
            return 0;
        });
    }

    _filterByAge(value) {
        return this.visibleEntries.filter(it => it.age <= value);
    }

    _filterByColor(value) {
        return this.visibleEntries.filter(it => it.color === value);
    }
    
}

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

// Test

console.log(kittens.entries);
console.log(kittens.visibleEntries);

/* Carousel logic */

/* function getYoungestN(n) {
    let sorted = kittens.sort((a, b) => {
        return a.age - b.age;
    });
    let youngestN = sorted.slice(0, n);
    return youngestN;
}

let youngestFour = getYoungestN(4);
console.log(youngestFour);

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
    console.log(youngestFour[ctr]);
    let carouselSlide = document.getElementById('slide');
    let img = carouselSlide.children[0];
    img.src = youngestFour[ctr].image;
    img.alt = youngestFour[ctr].name;
});
 */