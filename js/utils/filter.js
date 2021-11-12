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

export function filterNonMatches(src, key, value) {
    return src.filter(it => it[key] !== value);
}
