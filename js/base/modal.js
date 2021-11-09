import { toggleMultipleClasses } from '../utils/dom.js';

class Modal {
    constructor(element) {
        this.element = element;
        this.offset = parseInt(this.element.id.slice(-1));
        this.content = this.element.querySelectorAll('.modal-content')[this.offset];
        this.closeElements = this.element.querySelectorAll('.modal-close');
    }

    init() {
        this.closeElements.forEach(el => el.addEventListener('click', () => {
            let id = parseInt(this.element.classList[1].slice(-1));
            this._closeModal(id);
        }));
    }

    showModal() {
        this.element.classList.toggle('display-none');
    }

    _closeModal(id) {
        this.content.removeChild(this.content.firstChild);
        toggleMultipleClasses(this.element, `modal-${id}`, 'display-none');
    }
}

export default Modal;
