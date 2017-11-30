var EndedState = function(recorder, updateInputs, checkDistanceKicks, checkMenuReturn) {
    function begin() {

    }

    function update(deltaTime) {
        recorder.recordTick();
        updateInputs();
        checkDistanceKicks();
        checkMenuReturn();
    }

    function end() {

    }

    return {
        begin: begin,
        update: update,
        end: end
    };
}