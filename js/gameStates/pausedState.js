var PausedState = function(updatePause) {
    function begin() {

    }

    function update() {
        updatePause();
    }

    function end() {

    }

    return {
        begin: begin,
        update: update,
        end: end
    };
}