class KittenCarousel {
    constructor(items, element, animate) {
        this.items = items;
        this.element = element;
        this.animate = animate;
        this.current = 0;
        this.previous = this.items.length - 1;
        this.next = this.current + 1;
        this.slideShowTimeout = null;
        this.slides = this.element.querySelectorAll('.carousel-slide');
        this.arrows = this.element.querySelectorAll('.carousel-button');
    }

    init() {
        this._loadCarousel();
        this.arrows.forEach(arrow => {
            arrow.addEventListener('click', e => this._onArrowClick(e));
            arrow.addEventListener('mouseenter', () => this._stopSlideShow());
            arrow.addEventListener('mouseleave', () => this._slideShow());
        });
    }

    refreshContent(items) {
        this.items = items;
        this._loadCarousel();
    }

    _loadCarousel() {
        this.slides.forEach(slide => this._loadSlide(slide));
        if (this.animate) this.slideShowTimeout = this._slideShow();
    }

    _onArrowClick(e) {
        const arrow = e.target.closest('.carousel-button');
        if (arrow.classList.contains('right')) this._moveRight();
        if (arrow.classList.contains('left')) this._moveLeft();
    }

    _loadSlide(slide) {
        slide.innerHTML = '';
        if (slide.classList.contains('left-side'))
            slide.innerHTML = this._createSlideContent(this.items[this.previous]);
        if (slide.classList.contains('active')) {
            slide.innerHTML = this._createSlideContent(this.items[this.current]);
            slide.childNodes[0].addEventListener('mouseenter', () => this._stopSlideShow());
            slide.childNodes[0].addEventListener('mouseleave', () => this._slideShow());
        }
        if (slide.classList.contains('right-side'))
            slide.innerHTML = this._createSlideContent(this.items[this.next]);
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

    _createSlideContent(item) {
        return `<img id="kitten-slide-${item.id}" src="${item.image}" alt="${item.name}">`;
    }

    _slideShow() {
        if (!this.animate) this.animate = true;
        return setTimeout(() => this._moveRight(), 5000);
    }

    _stopSlideShow() {
        this.animate = false;
        clearTimeout(this.slideShowTimeout);
        this.slideShowTimeout = null;
    }
}

export default KittenCarousel;
