var ControllerManager = function () {
    var gamepads = navigator.getGamepads();
    var controllers = [
        new Controller(),
        new Controller(),
        new Controller(),
        new Controller()
    ]

    function update() {
        gamepads = navigator.getGamepads();
        for (var i = 0; i < gamepads.length; i++) {
            controllers[i].update(gamepads[i]);
        }
    }

    return {
        update: update,
        controllers: controllers
    }
};
    
var Controller = function () {
    var mapping;
    var state;
    var toggles = [];
    var connected = false;

    function isConnected() {
        return connected;
    }

    function setMapping(newMapping) {
        mapping = JSON.parse(JSON.stringify(newMapping));
        toggles = [];
        for (var key in mapping) {
            var map = mapping[key];
            if (!map.toggle) {
                continue;
            }
            map.pressed = false;
            map.wasPressed = false;
            toggles.push(map);
        }
    }

    function getVector(map) {
        if (!connected) {
            return {
                x: 0,
                y: 0
            }
        }
        return {
            x: map.xaxis < state.axes.length ? state.axes[map.xaxis] : 0,
            y: map.yaxis < state.axes.length ? state.axes[map.yaxis] : 0
        }
    }

    function getButton(map) {
        if (!connected) {
            return false;
        }
        if (map.toggle) {
            return map.pressed;
        }
        return checkButtons(map.buttons);
    }

    function getAxisButton(map) {
        if (!connected) {
            return false;
        }
        if (map.toggle) {
            return map.pressed;
        }
        return checkAxisButtons(map.axes, map.threshold);
    }

    function checkButtons(buttons) {
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i] < state.buttons.length
                && state.buttons[buttons[i]].pressed) {
                return true;
            }
        }
        return false;
    }

    function checkAxisButtons(axes, threshold) {
        for (var i = 0; i < axes.length; i++) {
            if (axes[i] < state.axes.length) {
                if (threshold < 0 && state.axes[axes[i]] < threshold) {
                    return true;
                }
                if (threshold > 0 && state.axes[axes[i]] > threshold) {
                    return true;
                }
            }
        }
            
        return false;
    }

    function getId() {
        if (!state) {
            return "not available";
        }
        return state.id;
    }

    function get(name) {
        if (!mapping || !mapping[name]) {
            return undefined;
        }
        var map = mapping[name];
        switch (map.type) {
            case "button":
                return getButton(map);
            case "vector":
                return getVector(map);
            case "axisbutton":
                return getAxisButton(map);
        }
        return undefined;
    }
        
    function update(gamepadState) {
        state = gamepadState;
        if (!state || !state.axes) {
            connected = false;
            return;
        }
        connected = true;
        for (var i = 0; i < toggles.length; i++) {
            var map = toggles[i];
            if (map.wasPressed) {
                map.pressed = false;
                map.wasPressed = (map.type == "button")
                    ? checkButtons(map.buttons)
                    : checkAxisButtons(map.axes, map.threshold);
            }
            else {
                map.pressed = (map.type == "button")
                    ? checkButtons(map.buttons)
                    : checkAxisButtons(map.axes, map.threshold);
                map.wasPressed = map.pressed;
            }
        }
    }

    return {
        update: update,
        setMapping: setMapping,
        get: get,
        getId: getId,
        isConnected: isConnected
    }
}