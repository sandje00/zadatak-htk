let kittens;

async function loadJSON(path) {
    const data = await fetch(path);
    return data.json();
}

async function main() {
    kittens = await loadJSON('/kittens.json');
    console.log(kittens);
}

main();
