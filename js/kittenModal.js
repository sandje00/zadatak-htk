class KittenModal {
    constructor(element, event) {
        this.element = element;
        this.event = event;
        this.kitten = null;
        this.card = null;
        this.info = this.element.querySelectorAll('.info')[0];
        this.adoptButton = this.element.querySelectorAll('.modal-button')[0];
        this.closeElements = this.element.querySelectorAll('.modal-close');
    }

    init() {
        this.closeElements.forEach(el => el.addEventListener('click', () => this._closeModal()));
        this.adoptButton.addEventListener('click', () => {
            let result = confirm(`Jeste li sigurni da zelite udomiti macica po imenu ${this.kitten.name}?`);
            if (result) this._adoptKitten(this.kitten.id);
        });
    }
    
    showModal(kitten) {
        this.kitten = kitten;
        this.card = document.getElementById(`kitten-card-${kitten.id}`);
        this.info.innerHTML = this._createKittenInfoContent();
        this.element.classList.toggle('display-none');
    }

    _closeModal() {
        this.info.innerHTML = '';
        this.element.classList.toggle('display-none');
    }

    _adoptKitten() {
        this.event.detail.kittenId = this.kitten.id;
        this.element.dispatchEvent(this.event);
        if (this.card) this.card.remove();
        this._closeModal();
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
