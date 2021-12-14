import { confirmEvent } from './events.js';

class KittenPopup {
    constructor(element) {
        this.element = element;
        this.kitten = null;
        this.okButton = document.getElementById('popup-ok');
        this.cancelButton = document.getElementById('popup-cancel');
        this.namePlaceholder = document.getElementById('name-placeholder');
    }

    init() {
        this.okButton.addEventListener('click', () => this._confirm(true));
        this.cancelButton.addEventListener('click', () => this._confirm(false));
    }

    togglePopup(name = '') {
        this.namePlaceholder.innerHTML = name;
        this.element.classList.toggle('display-none');
    }

    _confirm(isConfirmed) {
        confirmEvent.detail.result = isConfirmed;
        this.element.dispatchEvent(confirmEvent);
        this.togglePopup();
    }
}

export default KittenPopup;
