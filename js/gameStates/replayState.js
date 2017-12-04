var ReplayState = function(recorder, checkCancel, runner, sound, switchGameState) {
    var kickOffTeam = undefined;

    function begin(team) {
        kickOffTeam = team;
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

    }

    return {
        name: "replay",
        begin: begin,
        update: update,
        end: end
    };
}
