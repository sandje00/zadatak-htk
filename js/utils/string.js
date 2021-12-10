export function extractNumberFromString(str) {
    const r = /(\d+)/;
    return parseInt(str.match(r));
}
