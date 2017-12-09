var RunningState = function(recorder, ball, playingField, updatePlayers, checkDistanceKicks, updateTimer) {

    function checkGoal()
    {
        if (ball.getPositionX() > playingField.rightGoalLine)
        {
            goalScored(GAME_TEAM_RED);
        } else if (ball.getPositionX() < playingField.leftGoalLine)
        {
            goalScored(GAME_TEAM_BLUE);
        }
    }

    function begin() {

    }

    function update(deltaTime) {
        recorder.recordTick();
        updatePlayers();
        checkDistanceKicks();
        updateTimer(deltaTime);
        checkGoal();
    }

    function end() {

    }

    return {
        name: "running",
        begin: begin,
        update: update,
        end: end
    };
}