/*

.______     ______    __  .__   __. .___________.
|   _  \   /  __  \  |  | |  \ |  | |           |
|  |_)  | |  |  |  | |  | |   \|  | `---|  |----`
|   ___/  |  |  |  | |  | |  . `  |     |  |
|  |      |  `--'  | |  | |  |\   |     |  |
| _|       \______/  |__| |__| \__|     |__|

*/

class Point {
    constructor(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw new TypeError('Arguments must be numbers');
        }
        this.x = x;
        this.y = y;
    }

    equals(other) {
        if (!other.constructor || other.constructor.name !== this.constructor.name) {
            throw new TypeError('Argument must a member be of the same class');
        }
        return this.x === other.x && this.y === other.y;
    }
}

/*

____    ____  _______   ______ .___________.  ______   .______
\   \  /   / |   ____| /      ||           | /  __  \  |   _  \
 \   \/   /  |  |__   |  ,----'`---|  |----`|  |  |  | |  |_)  |
  \      /   |   __|  |  |         |  |     |  |  |  | |      /
   \    /    |  |____ |  `----.    |  |     |  `--'  | |  |\  \----.
    \__/     |_______| \______|    |__|      \______/  | _| `._____|

*/

class Vector {
    constructor(x, y) {
        if (typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    magnitude() {
        let x = this.x;
        let y = this.y;
        return Math.sqrt((x * x) + (y * y));
    }

    normalize() {
        let magnitude = this.magnitude();

        if (magnitude !== 0) {
            this.x /= magnitude;
            this.y /= magnitude;
        }

        return this;
    }

    getNormal() {
        return new Vector(this).normalize();
    }

    scale(scalar) {
        if (typeof scalar !== 'number' || isNaN(scalar)) {
            throw new TypeError(`Cannot scale by ${scalar}`);
        }

        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    equals(other) {
        if (!other.constructor || other.constructor.name !== this.constructor.name) {
            throw new TypeError('Argument must a member be of the same class');
        }
        return this.x === other.x && this.y === other.y;
    }

    getOrthogonal() {
        return new Vector(this.y, this.x);
    }

    static validateInstance(obj) {
        if (!obj.constructor || obj.constructor.name !== this.name) {
            throw new TypeError('Must instance of class Vector');
        }
        if (typeof obj.x !== 'number' || isNaN(obj.x) || typeof obj.y !== 'number' || isNaN(obj.y)) {
            throw new TypeError(`Cannot operate on values ${obj.x} and ${obj.y}`);
        }
    }

    static add(a, b) {
        this.validateInstance(a);
        this.validateInstance(b);
        return new Vector(b.x + a.x, b.y + a.y);
    }

    static subtract(b, a) {
        this.validateInstance(a);
        this.validateInstance(b);
        return new Vector(a.x - b.x, a.y - b.y);
    }

    static dotProduct(a, b) {
        this.validateInstance(a);
        this.validateInstance(b);
        return (a.x * b.x) + (a.y * b.y);
    }

    static cross(a, b) {
        this.validateInstance(a);
        this.validateInstance(b);
        return (a.x * b.y) - (a.y * b.x);
    }

    static projectVector(a, b) {
        this.validateInstance(a);
        this.validateInstance(b);

        let projection = new Vector(b.x / b.magnitude(), b.y / b.magnitude());

        projection.scale(Vector.dotProduct(a, b) / b.magnitude());

        return projection;
    }

    static cosineTheta(a, b) {
        this.validateInstance(a);
        this.validateInstance(b);
        let numerator = Vector.dotProduct(a, b);
        let denominator = a.magnitude() * b.magnitude();
        return numerator / denominator;
    }
}

Vector.zero = new Vector(0, 0);

/*

 .______       _______   ______ .___________.
 |   _  \     |   ____| /      ||           |
 |  |_)  |    |  |__   |  ,----'`---|  |----`
 |      /     |   __|  |  |         |  |
 |  |\  \----.|  |____ |  `----.    |  |
 | _| `._____||_______| \______|    |__|

*/

class Rect {
    constructor(centerX, centerY, extentsX, extentsY) {
        // Extents is a vector relative to the center of the Rect. i.e. width/2 , height/2
        // If centerX is passed as an object it should be a point representing the Center.
        // In this case centerY will be a point representing the Extents of the Rect.

        if (typeof centerY === 'object') {
            this.center = new Vector(centerX.x, centerX.y);
            this.extents = new Vector(centerY.x, centerY.y);
        } else if (typeof centerX === 'object' && centerX.constructor.name === 'Rect') {
            this.center = new Vector(centerX.center.x, centerX.center.y);
            this.extents = new Vector(centerX.extents.x, centerX.extents.y);
        } else {
            this.center = new Vector(centerX, centerY);
            this.extents = new Vector(extentsX, extentsY);
        }
    }

    offset(dx, dy) {
        this.center.x += dx;
        this.center.y += dy;
    }

    getMin(vector) {
        let x = this.center.x - this.extents.x;
        let y = this.center.y - this.extents.y;

        if (vector && vector.constructor && vector.constructor.name === 'Vector') {
            vector.x = x;
            vector.y = y;
        } else {
            vector = new Point(x, y);
        }

        return vector;
    }

    getMax(vector) {
        let x = this.center.x + this.extents.x;
        let y = this.center.y + this.extents.y;

        if (vector && vector.constructor && vector.constructor.name === 'Vector') {
            vector.x = x;
            vector.y = y;
        } else {
            vector = new Point(x, y);
        }

        return vector;
    }

    getSize(vector) {
        let x = this.extents.x * 2;
        let y = this.extents.y * 2;

        if (vector && vector.constructor && vector.constructor.name === 'Vector') {
            vector.x = x;
            vector.y = y;
        } else {
            vector = new Point(x, y);
        }

        return vector;
    }

    scale(x, y) {
        this.extents.x *= x;
        this.extents.y *= y;
    }

    expand(x, y) {
        this.extents.x += x;
        this.extents.y += y;
    }

    getArea() {
        return this.extents.x * this.extents.y * 4;
    }

    equals(other) {
        return this.extents.equals(other.extents) && this.center.equals(other.center);
    }

    containsPoint(p, isExclusive) {
        let min = this.getMin();
        let max = this.getMax();

        if (isExclusive) {
            return (min.x < p.x &&
                    max.x > p.x &&
                    min.y < p.y &&
                    max.y > p.y);
        }

        return (min.x <= p.x &&
                max.x >= p.x &&
                min.y <= p.y &&
                max.y >= p.y);
    }

    static combine(a, b) {
        let min = {};
        let max = {};
        let aMin = a.getMin();
        let aMax = a.getMax();
        let bMin = b.getMin();
        let bMax = b.getMax();

        min.x = Math.min(aMin.x, bMin.x);
        min.y = Math.min(aMin.y, bMin.y);

        max.x = Math.max(aMax.x, bMax.x);
        max.y = Math.max(aMax.y, bMax.y);

        return new Rect(
            min.x + (max.x - min.x) / 2,
            min.y + (max.y - min.y) / 2,
            (max.x - min.x) / 2,
            (max.y - min.y) / 2
        );
    }

    static intersects(a, b) {
        let aMin = a.getMin();
        let aMax = a.getMax();
        let bMin = b.getMin();
        let bMax = b.getMax();

        return (aMin.x <= bMax.x &&
                aMax.x >= bMin.x &&
                aMin.y <= bMax.y &&
                aMax.y >= bMin.y);
    }

    static containsRect(a, b) {
        let aMin = a.getMin();
        let aMax = a.getMax();
        let bMin = b.getMin();
        let bMax = b.getMax();

        return (aMin.x <= bMin.x &&
                aMax.x >= bMax.x &&
                aMin.y <= bMin.y &&
                aMax.y >= bMax.y);
    }

    minkowskiDifference(a, b) {
        let aMin = a.getMin();
        let bMax = b.getMax();

        let topLeftX = aMin.x - bMax.x;
        let topLeftY = aMin.y - bMax.y;
        let extentsX = a.extents.x + b.extents.x;
        let extentsY = a.extents.y + b.extents.y;

        return new Rect(
            topLeftX + extentsX,
            topLeftY + extentsY,
            extentsX,
            extentsY
         );
    }

    nearestPointOnBounds(p, rect) {
        let rectMin = rect.getMin();
        let rectMax = rect.getMax();

        // FIXME: find better solution:

        let minDist = Math.abs(p.x - rectMin.x);
        let pointX = rectMin.x;
        let pointY = p.y;

        if (Math.abs(rectMax.x - p.x) <= minDist) {
            minDist = Math.abs(rectMax.x - p.x);
            pointX = rectMax.x;
            pointY = p.y;
        }
        if (Math.abs(rectMax.y - p.y) <= minDist) {
            minDist = Math.abs(rectMax.y - p.y);
            pointX = p.x;
            pointY = rectMax.y;
        }

        if (Math.abs(rectMin.y - p.y) <= minDist) {
            minDist = Math.abs(rectMin.y - p.y);
            pointX = p.x;
            pointY = rectMin.y;
        }

        return new Point(pointX, pointY);
    }
}

module.exports = {
    Point,
    Vector,
    Rect,
};
