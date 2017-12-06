var AfterGoalState = function(recorder, updateInputs, checkDistanceKicks) {
    var returnTimeout;

    function begin(kickOffTeam) {
        returnTimeout = window.setTimeout(function ()
        {
            switchGameState("replay", kickOffTeam);
        }, GAME_AFTER_GOAL_TIME);
    }

    function update(deltaTime) {
        recorder.recordTick();
        updateInputs();
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