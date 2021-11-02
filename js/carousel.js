class Carousel {
    constructor(items, element, className) {
        this.items = items;
        this.element = element;
        this.className = className;
        this.slide = element.querySelector(`#${this.className}-carousel-slide`);
        this.arrows = element.querySelectorAll(`.${this.className}-carousel-button`);
        this.counter = 0;
    }

    init() {
        this._loadCarousel(this._getCurrentItem());
        this.arrows.forEach(arrow => arrow.addEventListener('click', e => this._onArrowClick(e)));
    }

    _loadCarousel(current) {
        this.slide.innerHTML = '';
        this.slide.innerHTML += this._createCarouselSlide(current);
    }

    _onArrowClick(e) {
        const arrow = e.target.closest(`.${this.className}-carousel-button`);
        if (arrow.classList.contains('right'))
            this._loadCarousel(this._moveRight());
        if (arrow.classList.contains('left'))
            this._loadCarousel(this._moveLeft());
    }

    _createCarouselSlide(item) {
        return `<img src=${item.image} alt=${item.alt}>`;
    }

    _getCurrentItem() {
        return this.items[this.counter];
    }


    _moveRight() {
        this.counter = this.counter === this.items.length - 1 ? 0 : this.counter + 1;
        return this._getCurrentItem();
    }

    _moveLeft() {
        this.counter = this.counter === 0 ? this.items.length - 1 : this.counter - 1;
        return this._getCurrentItem();
    }
}

export default Carousel;
