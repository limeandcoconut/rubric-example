const {System} = require('rubricjs');
const {entityManager: em} = require('../managers.js');
const {Vector} = require('../utils/mathconstructs.js');
const Input = require('../utils/input.js');
const BezierEasing = require('bezier-easing');

class PlayerInputSystem extends System {
    constructor() {
        super();
        this.entityInput = null;
        this.inputQueue = [];
        this.requiredComponents = ['PlayerComponent', 'MobileComponent'];
        this.ease = new BezierEasing(0.25, 0, 0.5, 1);
    }

    loadInput(rawInput) {
        this.inputQueue.push(rawInput);
    }

    update() {
        let entities = em.getEntitiesWithComponents(this.requiredComponents);
        let inputQueue = this.inputQueue;
        if (!entities.length) {
            this.inputQueue = [];
            return;
        }
        let mobileComponent;
        let oldMotion;
        let compoundMotion;
        let oldSpeed;
        let speed;
        let maxVelocity;
        let velocity;
        let newMotion;
        let breakInput;

        // If there is no input skip to easing entities motion
        if (inputQueue.length) {
            let InputStates = Input.States;
            let state;
            newMotion = new Vector(0, 0);

            inputQueue.forEach((input) => {
                // Update motion and, if the input is additive
                state = input.getState();

                if (state === InputStates.UP || state === InputStates.NOT_DOWN) {
                    newMotion.y -= 1;
                } else if (state === InputStates.DOWN || state === InputStates.NOT_UP) {
                    newMotion.y += 1;
                } else if (state === InputStates.LEFT || state === InputStates.NOT_RIGHT) {
                    newMotion.x -= 1;
                } else if (state === InputStates.RIGHT || state === InputStates.NOT_LEFT) {
                    newMotion.x += 1;
                } else if (state === InputStates.BREAK_INPUT) {
                    breakInput = true;
                    newMotion.x = 0;
                    newMotion.y = 0;
                }
            });
        }

        entities.forEach((entity) => {
            mobileComponent = em.getComponent('MobileComponent', entity);
            oldMotion = mobileComponent.getMotion();

            // If there is added motion update the entity's motion
            if (newMotion) {
                if (breakInput) {
                    compoundMotion = newMotion;
                } else {
                    compoundMotion = Vector.add(newMotion, oldMotion);
                }
                mobileComponent.setMotion(compoundMotion);
            } else {
                compoundMotion = oldMotion;
            }

            maxVelocity = mobileComponent.getMaxVelocity();
            oldSpeed = mobileComponent.getVelocity().magnitude();
            // Initialize speed to maximum
            speed = maxVelocity;
            // Provide new velocity based on direction of motion
            velocity = new Vector(compoundMotion);
            velocity.normalize();

            // If the entity is not traveling at maximum speed ease it upwards
            if (oldSpeed < maxVelocity) {
                speed = ((this.ease(oldSpeed / maxVelocity) * 0.90) + 0.1) * maxVelocity;
            }
            // Scale and set new velocity
            velocity.scale(speed);
            mobileComponent.setVelocity(velocity);
        });

        this.inputQueue = [];
    }
}

module.exports = PlayerInputSystem;
