/* Fetch data */

async function loadJSON(path) {
    const data = await fetch(path);
    return data.json();
}

async function main() {
    kittens = await loadJSON('/kittens.json');
    localStorage.setItem('kittens', JSON.stringify(kittens))
}

main();

let kittens = JSON.parse(localStorage.getItem('kittens'));


/* Carousel logic */

function getYoungestN(n) {
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
