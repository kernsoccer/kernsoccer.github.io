var RunningState = function(recorder, updateInputs, checkDistanceKicks, updateTimer, checkGoal) {

    function begin() {

    }

    function update(deltaTime) {
        recorder.recordTick();
        updateInputs();
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