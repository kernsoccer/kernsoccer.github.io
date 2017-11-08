var ControllerHelper = function ()
{
    var useKeyboard = true;

    function getControllerStates()
    {
        var allPads = navigator.getGamepads();

        var activePads = [];

        for (var i = 0; i < 4; i++)
        {
            var loopedPad = allPads[i];

            if (!loopedPad)
            {
                loopedPad = {
                    buttons: [
                        { pressed: false }, // 0
                        { pressed: false }, // 1
                        { pressed: false }, // 2
                        { pressed: false }, // 3
                        { pressed: false }, // 4
                        { pressed: false }, // 5
                        { pressed: false }, // 6
                        { pressed: false }, // 7
                        { pressed: false }, // 8
                        { pressed: false }, // 9
                    ],
                    axes: [0, 0]
                };
            }

            activePads.push(loopedPad);

            // if (loopedPad.buttons[8].pressed) {
            //   window.location.reload();
            // }
        }
        
        if (useKeyboard)
        {
            for (var i = 0; i < keyboardStates.length; i++)
            {
                activePads[i].axes = keyboardStates[i].axes;
                activePads[i].buttons = keyboardStates[i].buttons;
            }
        }

        return activePads;
    }

    // Initialize override object.
    var keyboardStates = [];

    for (var i = 0; i < 4; i++)
    {
        keyboardStates[i] = {
            buttons: [],
            axes: [0, 0]
        };

        for (var j = 0; j < 10; j++)
        {
            keyboardStates[i].buttons[j] = { pressed: false };
        }
    }
    
    function setKeyState(key, newState)
    {
        switch (key)
        {
            /* Player 1 */
            case 'a':
                keyboardStates[0].axes[0] = newState ? -1 : 0;
                break;
            case 'd':
                keyboardStates[0].axes[0] = newState ? 1 : 0;
                break;
            case 'w':
                keyboardStates[0].axes[1] = newState ? -1 : 0;
                break;
            case 's':
                keyboardStates[0].axes[1] = newState ? 1 : 0;
                break;
            case 'e': // kick
                keyboardStates[0].buttons[0].pressed = newState;
                break;
            case 'q': // boost
                keyboardStates[0].buttons[4].pressed = newState;
                break;
            /* Player 2 */
            case 'j':
                keyboardStates[1].axes[0] = newState ? -1 : 0;
                break;
            case 'l':
                keyboardStates[1].axes[0] = newState ? 1 : 0;
                break;
            case 'i':
                keyboardStates[1].axes[1] = newState ? -1 : 0;
                break;
            case 'k':
                keyboardStates[1].axes[1] = newState ? 1 : 0;
                break;
            case 'u': // kick
                keyboardStates[1].buttons[0].pressed = newState;
                break;
            case 'o': // boost
                keyboardStates[1].buttons[0].pressed = newState;
                break;
                
            /* Controls structures */
            case 'b':
                keyboardStates[0].buttons[PLAYER_INPUT_PAUSE].pressed = newState;
                break;
            case 'n':
                keyboardStates[0].buttons[PLAYER_INPUT_MENU].pressed = newState;
                break;
        }
    }

    document.body.addEventListener('keydown', function (e)
    {
        setKeyState(e.key, true);
    });

    document.body.addEventListener('keyup', function (e)
    {
        setKeyState(e.key, false);
    });

    return {
        getControllerStates: getControllerStates
    }
};
