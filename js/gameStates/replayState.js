var ReplayState = function(recorder, controllers, runner, sound, switchGameState) {
    var kickOffTeam = undefined;

    function checkCancel()
    {
        for (var i = 0; i < controllers.length; i++)
        {
            if (controllers[i].get("cancel"))
            {
                return true;
            }
        }
        return false;
    }

    function begin(team) {
        kickOffTeam = team;
        runner.enabled = false;
    }

    function update() {
        recorder.playTick();

        if (recorder.isDone() || checkCancel())
        {
            runner.enabled = true;
            if (kickOffTeam === undefined) {
                switchGameState("ended");
            }
            else {
                switchGameState("kickoff", kickOffTeam);
            }
        }
    }

    function end() {
        runner.enabled = true;
    }

    return {
        name: "replay",
        begin: begin,
        update: update,
        end: end
    };
}
