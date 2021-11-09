export function extractNumber(str) {
    const r = /\d+/;
    return parseInt(str.match(r)[0]);
}
