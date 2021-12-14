class KittenModal {
    constructor(element, event, popup) {
        this.element = element;
        this.event = event;
        this.popup = popup;
        this.kitten = null;
        this.card = null;
        this.info = this.element.querySelectorAll('.info')[0];
        this.adoptButton = this.element.querySelectorAll('.modal-button')[0];
        this.closeElements = this.element.querySelectorAll('.modal-close');
    }

    init() {
        this.element.addEventListener('confirm', e => e.detail.result && this._adoptKitten(this.kitten.id));
        this.closeElements.forEach(el => el.addEventListener('click', () => this._closeModal()));
        this.adoptButton.addEventListener('click', () => this.popup.togglePopup(this.kitten.name));
    }
    
    showModal(kitten) {
        this.kitten = kitten;
        this.card = document.getElementById(`kitten-card-${kitten.id}`);
        this.info.innerHTML = this._createKittenInfoContent();
        this.element.classList.toggle('display-none');
    }

    _adoptKitten() {
        this.event.detail.kittenId = this.kitten.id;
        this.element.dispatchEvent(this.event);
        if (this.card) this.card.remove();
        this._closeModal();
    }

    _closeModal() {
        this.info.innerHTML = '';
        this.element.classList.toggle('display-none');
    }

    _createKittenInfoContent() {
        return `
            <img src="${this.kitten.image}" alt="${this.kitten.name}">
            <h4>${this.kitten.name}</h4>
            <span class="align-self-start">Starost: ${this.kitten.age}</span>
            <span class="align-self-start">Boja: ${this.kitten.color}</span>
        `;
    }
}

export default KittenModal;
