var MenuState = function(menu) {
    function begin() {

    }

    function update() {
        menu.update();
    }

    function end() {

    }

    return {
        name: "menu",
        begin: begin,
        update: update,
        end: end
    };
}