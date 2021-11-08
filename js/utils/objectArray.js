export function alphabeticSort(src, key, isAscending) {
    return src.slice().sort((a, b) => {
        let entryA = a[key].toUpperCase();
        let entryB = b[key].toUpperCase();
        if (entryA < entryB) return isAscending ? -1 : 1;
        if (entryA > entryB) return isAscending ? 1 : -1;
        return 0;
    });
}

export function numericSort(src, key, isAscending) {
    return src.slice().sort((a, b) => {
        return isAscending ? a[key] - b[key] : b[key] - a[key];
    });
}

export function filterByKeyword(src, key, keyword) {
    return src.filter(it => it[key]
        .toString()
        .toUpperCase()
        .includes(keyword));
}

export function filterEqual(src, key, value) {
    return src.filter(it => it[key] === value)
}

export function filterLessEqual(src, key, value) {
    return src.filter(it => it[key] <= value);
}
