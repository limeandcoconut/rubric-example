const {System} = require('rubricjs');
const {entityManager: em} = require('../managers.js');
const Canvas = require('../utils/canvas.js');

class RenderSystem extends System {
    constructor(canvas) {
        super();
        console.log(canvas);
        if (!(canvas instanceof Canvas)) {
            throw new TypeError('Argument should be instance of class Canvas');
        }

        this.canvasCtx = canvas.ctx;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.updateRequested = false;

        this.requiredComponents = ['RenderComponent', 'SpatialComponent'];

        this.previousLocations = [];
    }

    update() {
        let entities = em.getEntitiesWithComponents(this.requiredComponents);

        let spatialComponent;
        let location;
        let previousLocation;

        entities.forEach((entity) => {

            spatialComponent = em.getComponent('SpatialComponent', entity);
            location = spatialComponent.getLocation();

            previousLocation = this.previousLocations[entity];

            if (!previousLocation || !previousLocation.equals(location)) {
                this.previousLocations[entity] = location;
                this.updateRequested = true;
            }
        });

        if (this.updateRequested) {
            this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.renderEntities(entities, this.canvasCtx);
        }

        this.updateRequested = false;
    }

    renderEntities(entities, canvasCtx) {
        let spatialComponent;
        let location;
        let renderComponent;
        let rect;
        let rectMin;

        entities.forEach((entity) => {
            renderComponent = em.getComponent('RenderComponent', entity);

            spatialComponent = em.getComponent('SpatialComponent', entity);
            location = spatialComponent.getLocation();

            rect = renderComponent.getRect();
            canvasCtx.fillStyle = renderComponent.getColor();

            rectMin = rect.getMin();
            canvasCtx.fillRect(rectMin.x + location.x, rectMin.y + location.y, rect.extents.x * 2, rect.extents.y * 2);
        });
    }
}

module.exports = RenderSystem;
