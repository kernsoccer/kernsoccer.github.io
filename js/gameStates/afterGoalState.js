var AfterGoalState = function(recorder, updatePlayers, checkDistanceKicks, switchGameState) {
    var returnTimeout;

    function begin(kickOffTeam) {
        returnTimeout = window.setTimeout(function ()
        {
            switchGameState("replay", kickOffTeam);
        }, GAME_AFTER_GOAL_TIME);
    }

    function update(deltaTime) {
        recorder.recordTick();
        updatePlayers(true);
        checkDistanceKicks();
    }

    function end() {
        window.clearTimeout(returnTimeout);
    }

    return {
        name: "afterGoal",
        begin: begin,
        update: update,
        end: end
    };
}