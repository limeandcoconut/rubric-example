const docReady = require('doc-ready');
const keycode = require('keycode');
const InputAdapter = require('rubricjs').InputAdapter;

module.exports = class KeydownAdapter extends InputAdapter {
    constructor(config) {
        super(config);

        if (!config || typeof config !== 'object') {
            throw new TypeError(`Constructor must recieve a config object, ${config} given`);
        }

        this.keydown = new Map();
        this.preventKeys = config.preventKeys.map((value) => value.toUpperCase());
    }

    init() {
        if (!window || !document) {
            throw new Error('Unkown global context');
        }

        docReady(() => {
            let keydown = this.keydown;
            let preventKeys = this.preventKeys;

            function preventDefaults(event) {
                let code = keycode(event);
                if (preventKeys.indexOf(code) !== -1) {
                    event.preventDefault();
                }
            }

            document.body.addEventListener('keyup', (event) => {
                keydown.set(keycode(event).toUpperCase(), false);
            });

            document.body.addEventListener('keydown', (event) => {
                preventDefaults(event);
                keydown.set(keycode(event).toUpperCase(), true);
            });
        });
    }
};
