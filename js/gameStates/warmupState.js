var WarmupState = function(hud, sound, switchGameState) {
    function begin(team) {
        window.setTimeout(function ()
        {
            sound.playStart();
            switchGameState("kickoff", team);
        }, 3000);

        hud.showMessageQueue([
            { text: "3", duration: 1 },
            { text: "2", duration: 1 },
            { text: "1", duration: 1 },
            { text: "GO!", duration: 1 }
        ]);
    }

    function update() {
        
    }

    function end() {

    }

    return {
        name: "warmup",
        begin: begin,
        update: update,
        end: end
    };
}