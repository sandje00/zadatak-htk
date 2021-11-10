export function toggleMultipleClasses(el, ...classes) {
    classes.forEach(className => el.classList.toggle(className));
}

export function hide(element) {
    element.classList.add('display-none');
}
