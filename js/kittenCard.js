class KittenCard {
    constructor(item, action) {
        this.card = null;
        this.item = item;
        this.action = action;
    }

    renderCard() {
        this.card = document.createElement('div');
        this.card.id = `kitten-${this.item.id}`;
        this.card.classList.add('kitten-search-card');
        this.card.addEventListener('click', () => this._onCardClick());
        this.card.innerHTML = `
            <img src="${this.item.image}" alt="${this.item.name}">
            <div class="container flex-v align-left">
                <h4>${this.item.name}</h4>
                <span>Starost: ${this.item.age}</span>
                <span>Boja: ${this.item.color}</span>
            </div>
        `;
        return this.card;
    }

    _onCardClick() {
        this.action(this.item);
    }
}

export default KittenCard;
