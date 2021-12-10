class KittenCard {
    constructor(item) {
        this.card = null;
        this.item = item;
    }

    createCardcontent() {
        return `
            <div id="kitten-card-${this.item.id}" class="kitten-search-card">
                <img src="${this.item.image}" alt="${this.item.name}">
                <div class="container flex-v align-left">
                    <h4>${this.item.name}</h4>
                    <span>Starost: ${this.item.age}</span>
                    <span>Boja: ${this.item.color}</span>
                </div>
            </div>
        `;
    }
}

export default KittenCard;
