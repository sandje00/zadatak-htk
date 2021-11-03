class Carousel {
    constructor(items, element) {
        this.items = items;
        this.element = element;
        this.arrows = element.querySelectorAll('.carousel-button');
        this.current = 0;
        this.previous = this.items.length - 1;
        this.next = this.current + 1;
    }

    init() {
        this._loadCarousel();
        this.arrows.forEach(arrow => arrow.addEventListener('click', e => this._onArrowClick(e)));
    }

    _loadCarousel() {
        const slides = this.element.querySelectorAll('.carousel-slide');
        slides.forEach(slide => {
            slide.innerHTML = '';
            if (slide.classList.contains('left'))
                slide.appendChild(this._createSlideContent(this.items[this.previous]));
            if (slide.classList.contains('active'))
                slide.appendChild(this._createSlideContent(this.items[this.current]));
            if (slide.classList.contains('left'))
                slide.appendChild(this._createSlideContent(this.items[this.next]));
        });
    }

    _onArrowClick(e) {
        const arrow = e.target.closest('.carousel-button');
        if (arrow.classList.contains('right')) this._moveRight();
        if (arrow.classList.contains('left')) this._moveLeft();
    }

    _createSlideContent(item) {
        const slideContent = document.createElement('img');
        slideContent.src = item.image;
        slideContent.alt = item.name;
        return slideContent;
    }

    _moveRight() {
        this.previous = this.current;
        this.current = this.next
        this.next = this.next === this.items.length - 1 ? 0 : this.next + 1;
        this._loadCarousel();
    }

    _moveLeft() {
        this.next = this.current;
        this.current = this.previous
        this.previous = this.previous === 0 ? this.items.length - 1 : this.previous - 1;
        this._loadCarousel();
    }
}

export default Carousel;
