var WarmupState = function(hud, sound, playingField, ball, resetTeam, switchGameState) {
    function begin(team) {
        // code double from kickoffstate
        resetTeam(GAME_TEAM_RED, playingField.leftTeamLine);
        resetTeam(GAME_TEAM_BLUE, playingField.rightTeamLine);
        ball.reset();
        
        window.setTimeout(function ()
        {
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
        sound.playStart();
        playingField.hideBarrier();
    }

    return {
        name: "warmup",
        begin: begin,
        update: update,
        end: end
    };
}