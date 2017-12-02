var PausedState = function(updatePause) {
    function begin() {

    }

    function update() {
        updatePause();
    }

    function end() {

    }

    return {
        name: "paused",
        begin: begin,
        update: update,
        end: end
    };
}