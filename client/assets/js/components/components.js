const {Point, Vector, Rect} = require('../utils/mathconstructs.js');

class SpatialComponent {
    constructor(x, y) {
        // If x is passed as an object it should be a point representing the Location.
        this.location = new Point(0, 0);
        this.setLocation(x, y);
    }

    getLocation() {
        return new Point(this.location.x, this.location.y);
    }

    setLocation(x, y) {
        if (typeof x === 'object') {
            this.location.x = Math.round(x.x);
            this.location.y = Math.round(x.y);
            return;
        }
        this.location.x = Math.round(x);
        this.location.y = Math.round(y);
    }
}

class RenderComponent {
    constructor(rect, color) {

        if (!(rect instanceof Rect)) {
            throw new TypeError('Argument rect is requried to be an instance of Rect');
        }

        if (!color && typeof color !== 'string') {
            throw new TypeError('Argument color must be a String if passed');
        }

        this.color = color || 'magenta';
        this.rect = rect;
    }

    getRect() {
        return this.rect;
    }

    getColor() {
        return this.color;
    }
}

class MobileComponent {
    constructor(maxVelocity) {
        this.maxVelocity = maxVelocity;
        this.velocity = new Vector(0, 0);
        this.motion = new Vector(0, 0);
    }

    getMaxVelocity() {
        return this.maxVelocity;
    }

    getVelocity() {
        return this.velocity;
    }

    setVelocity(velocity) {
        this.velocity = velocity;
    }

    getMotion() {
        return this.motion;
    }

    setMotion(motion) {
        this.motion = motion;
    }
}

class PlayerComponent {}

module.exports = {
    SpatialComponent,
    RenderComponent,
    MobileComponent,
    PlayerComponent,
};
