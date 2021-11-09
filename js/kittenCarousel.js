import Carousel from './base/carousel.js';

class KittenCarousel extends Carousel{
    constructor(items, element, animate) {
        super(items, element, animate);
        this.slides = element.querySelectorAll('.carousel-slide');
    }

    init() {
        this._loadCarousel();
        super.init();
    }

    _loadCarousel() {
        this.slides.forEach(slide => this._loadSlide(slide));
        super._loadCarousel();
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

    _createSlideContent(item, isActive = false) {
        const slideContent = document.createElement('img');
        slideContent.src = item.image;
        slideContent.alt = item.name;
        slideContent.onmouseover = isActive ? () => this._onMouseOver() : null;
        return slideContent;
    }
}

export default KittenCarousel;
