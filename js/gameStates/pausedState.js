var PausedState = function(hud, runner, ball, switchGameState) {
    var state;
    var controller;
    var ball;

    function begin(switchOptions) {
        controller = switchOptions.controller;
        state = switchOptions.prevState;
        hud.showMessage("PAUSED", "red");
        var velo = ball.getBody().velocity;
        velo = Matter.Vector.mult(velo, -1);
        Matter.Body.setVelocity(ball.getBody(), velo);
        runner.enabled = false;
    }

    function update() {
        if (!controller.isConnected() || controller.get("pause"))
        {
            switchGameState(state, "noReset");
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