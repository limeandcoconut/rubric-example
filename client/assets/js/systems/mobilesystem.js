const {System} = require('rubricjs');
const {entityManager: em} = require('../managers.js');

class MobileSystem extends System {
    constructor() {
        super();
        this.requiredComponents = ['MobileComponent', 'SpatialComponent'];
    }

    update() {
        let entities = em.getEntitiesWithComponents(this.requiredComponents);
        let mobileComponent;
        let motion;
        let spatialComponent;
        let velocity;
        let location;

        entities.forEach((entity) => {
            mobileComponent = em.getComponent('MobileComponent', entity);
            motion = mobileComponent.getMotion();

            if (motion.magnitude() === 0) {
                return;
            }

            spatialComponent = em.getComponent('SpatialComponent', entity);

            velocity = mobileComponent.getVelocity();
            location = spatialComponent.getLocation();

            location.x += velocity.x;
            location.y += velocity.y;

            spatialComponent.setLocation(location);
        });
    }
}

module.exports = MobileSystem;
