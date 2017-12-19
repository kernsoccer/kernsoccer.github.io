var MenuState = function(menu, runner) {
    function begin() {
        menu.show();
        runner.enabled = false;
    }

    function update() {
        menu.update();
    }

    function end() {
        menu.hide();
    }

    return {
        name: "menu",
        begin: begin,
        update: update,
        end: end
    };
}