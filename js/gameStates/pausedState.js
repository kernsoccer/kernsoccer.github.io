var PausedState = function(hud, runner, switchGameState) {
    var state;
    var controller;

    function begin(pausingController, prevState) {
        controller = pausingController;
        state = prevState;
        hud.showMessage("PAUSED", "red");
        runner.enabled = false;
    }

    function update() {
        if (!controller.isConnected() || controller.get("pause"))
        {
            switchGameState(state);
            return;
        }
        if (controller.get("menu"))
        {
            switchGameState("menu");
        }
    }

    function end() {
        hud.hideMessage();
        runner.enabled = true;
    }

    return {
        name: "paused",
        begin: begin,
        update: update,
        end: end
    };
}