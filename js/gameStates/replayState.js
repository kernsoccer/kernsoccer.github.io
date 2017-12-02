var ReplayState = function(recorder, prepareKickoff, checkCancel, runner, sound, switchGameState) {
    var kickOffTeam = undefined;

    function begin(team) {
        kickOffTeam = team;
    }

    function update() {
        if (kickOffTeam === undefined)
        {
            recorder.playTick();
            if (recorder.isDone() || checkCancel())
            {
                runner.enabled = true;
                switchGameState("ended");
            }
        }
        else 
        {
            recorder.playTick();
            if (recorder.isDone() || checkCancel())
            {
                runner.enabled = true;
                prepareKickoff(kickOffTeam);
                sound.playStart();
                switchGameState("kickoff");
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
