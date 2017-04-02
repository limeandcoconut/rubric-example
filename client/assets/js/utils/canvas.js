class Canvas {
    constructor(id, smoothing) {
        this.element = window[id];
        this.width = this.element.getAttribute('width');
        this.height = this.element.getAttribute('height');
        this.id = id;
        this.ctx = this.element.getContext('2d');

        if (!smoothing) {
            this.ctx.imageSmoothingEnabled = false;
        }
    }
}

module.exports = Canvas;
