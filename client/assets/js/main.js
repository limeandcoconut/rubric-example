const {Rubric} = require('rubricjs');
const {systemManager, entityFactory, entityManager} = require('./managers.js');
const KeydownAdapter = require('./utils/keydownadapter');
const Canvas = require('./utils/canvas.js');
const Input = require('./utils/input.js');
const RenderSystem = require('./systems/rendersystem.js');
const MobileSystem = require('./systems/mobilesystem.js');
const PlayerInputSystem = require('./systems/playerinputsystem.js');
const {RenderComponent, SpatialComponent, PlayerComponent, MobileComponent} = require('./components/components.js');
const {Rect} = require('./utils/mathconstructs.js');
const config = require('./rubric.config.js');
const docReady = require('doc-ready');

docReady(() => {
    const rubric = new Rubric(config);
    // Lets instanciate a little helper class and then a Render System
    let canvas = new Canvas('canvas');
    systemManager.register(new RenderSystem(canvas));
    // System that moves the player
    systemManager.register(new MobileSystem());
    // Register the system that manages input
    let playerInputSystem = new PlayerInputSystem();
    systemManager.register(playerInputSystem);

    // This will prevent input when the window is blurred
    let noInput = false;

    window.onblur = () => {
        noInput = true;
    };

    window.onfocus = () => {
        noInput = false;
    };

    let oldKeydown = {};
    let InputStates = Input.States;

    // Set our update method because it didn't exist in the config
    rubric.setUpdate(() => {
        // This is the map of pressed keys
        let keydown = rubric.primaryInput.keydown;
        if (noInput) {
            keydown.clear();
            playerInputSystem.loadInput(new Input(InputStates.BREAK_INPUT));
        }

        keydown.forEach((value, key) => {
            // If the key has changes since the last update
            if (value !== oldKeydown.get(key)) {
                // And if it is a key we have a state for
                if (InputStates[key] || InputStates[`NOT_${key}`]) {
                    playerInputSystem.loadInput(
                        new Input(InputStates[value ? key : `NOT_${key}`])
                    );
                }
            }
        });

        // Set the oldMap equal to the current map
        oldKeydown = new Map(keydown);

        // Update all the systems
        systemManager.update();
    });

    // This will register with the window and map keypresses
    let keydownAdapter = new KeydownAdapter(config);
    rubric.addPrimaryInputAdapter(keydownAdapter);
    // This sets up input adapters
    rubric.init();

    // Register a factory method for creating entities
    entityFactory.registerConstructor('player', (x, y, rect, color, maxVelocity) => {
        var player = entityManager.createEntity();
        // This gives the entity a position
        entityManager.addComponent(new SpatialComponent(x, y), player);
        // This allows the entity to move
        entityManager.addComponent(new MobileComponent(maxVelocity), player);
        // This allows the entity to be rendered
        entityManager.addComponent(new RenderComponent(rect, color), player);
        // This tags the entity as a player so input will be passed to it
        entityManager.addComponent(new PlayerComponent(), player);
        return player;
    });

    // Great! This is where you create an entity 🤖
    entityFactory.createPlayer(10, 10, new Rect(0, 0, 10, 10), '#00ffcb', 5);

    // Now we're cooking with gas 🚀
    rubric.start();
});
