var KickoffState = function(recorder, updateInputs, checkDistanceKicks) {
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
        name: "kickoff",
        begin: begin,
        update: update,
        end: end
    };
}