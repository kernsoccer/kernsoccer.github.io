var AfterGoalState = function(recorder, updateInputs, checkDistanceKicks) {
    function begin() {

    }

    function update(deltaTime) {
        recorder.recordTick();
        updateInputs();
        checkDistanceKicks();
    }

    function end() {

    }

    return {
        begin: begin,
        update: update,
        end: end
    };
}