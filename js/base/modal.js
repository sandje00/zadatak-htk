import { extractNumberFromString } from '../utils/string.js';
import { toggleMultipleClasses } from '../utils/dom.js';

class Modal {
    constructor(element) {
        this.element = element;
        this.info = this.element.querySelectorAll('.info')[0];
        this.closeElements = this.element.querySelectorAll('.modal-close');
    }

    init() {
        this.closeElements.forEach(el => el.addEventListener('click', () => {
            let id = extractNumberFromString(this.element.classList[1]);
            this._closeModal(id);
        }));
    }

    showModal() {
        this.element.classList.toggle('display-none');
    }

    _closeModal(id) {
        this.info.innerHTML = '';
        toggleMultipleClasses(this.element, `modal-${id}`, 'display-none');
    }
}

export default Modal;
