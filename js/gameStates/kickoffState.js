var KickoffState = function(recorder, playingField, ball, resetTeam, updateInputs, checkDistanceKicks, switchGameState) {
    var centerPosition;
    function begin(team) {
        resetTeam(GAME_TEAM_RED, playingField.leftTeamLine);
        resetTeam(GAME_TEAM_BLUE, playingField.rightTeamLine);

        if (team == GAME_TEAM_RED)
        {
            playingField.showRightBarrier();
        }
        else
        {
            playingField.showLeftBarrier();
        }
        ball.reset();
        centerPosition = ball.getPosition();
        recorder.reset();
        sound.playStart();
    }

    function update(deltaTime) {
        recorder.recordTick();
        updateInputs();
        checkDistanceKicks();
        var ballPosition = ball.getPosition();
        if (ballPosition != centerPosition) {
            switchGameState("running");
        }
    }

    function end() {
        playingField.hideBarrier();
    }

    return {
        name: "kickoff",
        begin: begin,
        update: update,
        end: end
    };
}