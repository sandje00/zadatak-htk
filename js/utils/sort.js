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
