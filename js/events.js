export const kittenAdoptedEvent = new CustomEvent('kitten-adopted', {
    detail: {},
    bubbles: true,
    cancelable: true,
    composed: false
});

export const kittensUpdatedEvent = new CustomEvent('kittens-updated', {
    detail: {},
    bubbles: true,
    cancelable: true,
    composed: false
});

export const confirmEvent = new CustomEvent('confirm', {
    detail: {},
    bubbles: true,
    cancelable: true,
    composed: false
});
