export function toggleMultipleClasses(el, ...classes) {
    classes.forEach(className => el.classList.toggle(className));
}
