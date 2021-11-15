import { kittensUpdatedEvent } from '../events.js';

export function toggleMultipleClasses(el, ...classes) {
    classes.forEach(className => el.classList.toggle(className));
}

export function hide(element) {
    element.classList.add('display-none');
}

export function updateKittenList(element, updateAction) {
    kittensUpdatedEvent.detail.kittens = updateAction();
    element.dispatchEvent(kittensUpdatedEvent);
}
