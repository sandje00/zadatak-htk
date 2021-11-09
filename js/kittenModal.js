import Modal from './base/modal.js';

class KittenModal extends Modal {
    constructor(element) {
        super(element);
        this.kitten = null;
        this.card = null;
        this.adoptButton = this.element.querySelectorAll('.modal-button')[this.offset];
    }

    init() {
        super.init();
        this.adoptButton.addEventListener('click', () => {
            let result = confirm(`Jeste li sigurni da zelite udomiti macica po imenu ${this.kitten.name}?`);
            if (result) this._adoptKitten(this.kitten.id);
        });
    }
    
    showModal(kitten, card) {
        this.kitten = kitten;
        this.card = card;
        let kittenInfo = this._createKittenInfoElement();
        this.content.insertBefore(kittenInfo, this.content.firstChild);
        this.element.classList.toggle(`modal-${this.kitten.id}`);
        super.showModal();
    }

    _adoptKitten() {
        this.card.remove();
        this._closeModal();
    }

    _createKittenInfoElement() {
        let kittenInfo = `
            <img src="${this.kitten.image}" alt="${this.kitten.name}">
            <h4>${this.kitten.name}</h4>
            <span>Starost: ${this.kitten.age}</span>
            <span>Boja: ${this.kitten.color}</span>
        `;
        let kittenInfoContainer = document.createElement('div');
        kittenInfoContainer.classList.add('kitten-info', 'flex-v', 'justify-center', 'align-center');
        kittenInfoContainer.innerHTML = kittenInfo;
        return kittenInfoContainer;
    }
}

export default KittenModal;
