var MenuState = function(menu) {
    function begin() {

    }

    function update() {
        menu.update();
    }

    function end() {

    }

    return {
        begin: begin,
        update: update,
        end: end
    };
}