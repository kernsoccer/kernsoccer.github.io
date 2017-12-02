var ReplayState = function(recorder, checkCancel, runner, sound, switchGameState) {
    var gameEnded = false;
    function begin(ended) {
        gameEnded = ended;
    }

    function update() {
        if (gameEnded)
        {
            checkMenuReturn();
            recorder.playTick();
            if (recorder.isDone() || checkCancel())
            {
                runner.enabled = true;
                currentGameState = GAME_STATE.ENDED;
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
