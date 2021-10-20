class CarouselController {
    constructor(items) {
        this.items = items;
        this.counter = 0;
    }

    getCurrentItem() {
        return this.items[this.counter];
    }

    moveRight() {
        this.counter = this.counter === this.items.length ? 0 : this.counter + 1;
        return this.getCurrentItem();
    }

    moveLeft() {
        this.counter = this.counter === 0 ? this.items.length - 1 : this.counter - 1;
        return this.getCurrentItem();
    }
}

export default CarouselController;
