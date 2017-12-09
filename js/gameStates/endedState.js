var EndedState = function(recorder, updatePlayers, checkDistanceKicks, checkMenuReturn) {
    function begin() {

    }

    function update(deltaTime) {
        recorder.recordTick();
        updatePlayers();
        checkDistanceKicks();
        checkMenuReturn();
    }

    function end() {

    }

    return {
        name: "ended",
        begin: begin,
        update: update,
        end: end
    };
}