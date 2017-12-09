var KickoffState = function(recorder, sound, playingField, ball, resetTeam, updatePlayers, checkDistanceKicks, switchGameState) {
    var centerPosition;
    function begin(team) {
        // code double from warmupstate
        resetTeam(GAME_TEAM_RED, playingField.leftTeamLine);
        resetTeam(GAME_TEAM_BLUE, playingField.rightTeamLine);
        ball.reset();

        if (team == GAME_TEAM_RED)
        {
            playingField.showRightBarrier();
        }
        else
        {
            playingField.showLeftBarrier();
        }
        
        centerPosition = JSON.parse(JSON.stringify(ball.getPosition()));
        recorder.reset();
        sound.playStart();
    }

    function update(deltaTime) {
        recorder.recordTick();
        updatePlayers();
        checkDistanceKicks();
        var ballPosition = ball.getPosition();
        if (ballPosition.x != centerPosition.x ||
            ballPosition.y != centerPosition.y) {
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