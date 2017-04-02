class Input {
    constructor(inputState) {
        this.inputState = inputState;
    }

    setState(inputState) {
        this.inputState = inputState;
    }

    getState() {
        return this.inputState;
    }
}

Input.States = Object.freeze({
    LEFT: 'left',
    NOT_LEFT: 'not_left',
    RIGHT: 'right',
    NOT_RIGHT: 'not_right',
    UP: 'up',
    NOT_UP: 'not_up',
    DOWN: 'down',
    NOT_DOWN: 'not_down',
    BREAK_INPUT: 'break_input',
});

module.exports = Input;
