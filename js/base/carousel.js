class Carousel {
    constructor(items, element, animate) {
        this.items = items;
        this.element = element;
        this.animate = animate;
        this.arrows = this.element.querySelectorAll('.carousel-button');
        this.current = 0;
        this.previous = this.items.length - 1;
        this.next = this.current + 1;
        this.slideShowTimeout = null;
    }

    init() {
        this.arrows.forEach(arrow => arrow.addEventListener('click', e => this._onArrowClick(e)));
    }

    _loadCarousel() {
        if (this.animate) this.slideShowTimeout = this._slideShow();
    }

    _loadSlide(slide) {
        slide.innerHTML = '';
        if (slide.classList.contains('left-side'))
            slide.appendChild(this._createSlideContent(this.items[this.previous]));
        if (slide.classList.contains('active'))
            slide.appendChild(this._createSlideContent(this.items[this.current], true));
        if (slide.classList.contains('right-side'))
            slide.appendChild(this._createSlideContent(this.items[this.next]));
    }

    _onArrowClick(e) {
        this._stopSlideShow();
        const arrow = e.target.closest('.carousel-button');
        if (arrow.classList.contains('right')) this._moveRight();
        if (arrow.classList.contains('left')) this._moveLeft();
    }

    _createSlideContent(item, isActive = false) {
        const slideContent = document.createElement('img');
        slideContent.src = item.image;
        slideContent.alt = item.name;
        slideContent.onmouseover = isActive ? () => this._onMouseOver() : null;
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

    _onMouseOver() {
        this._stopSlideShow();
    }

    _slideShow() {
        return setTimeout(() => this._moveRight(), 5000);
    }

    _stopSlideShow() {
        this.animate = false;
        clearTimeout(this.slideShowTimeout);
        this.slideShowTimeout = null;
    }
}

export default Carousel;
