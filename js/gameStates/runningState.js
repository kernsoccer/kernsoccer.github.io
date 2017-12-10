var RunningState = function(recorder, sound, hud, teamScores, gameOptions, ball, playingField, gameTimer, updatePlayers, checkDistanceKicks, switchGameState) {
    var drawnOverTime = false;
    var timePlayed;

    function checkGoal()
    {
        if (ball.getPositionX() > playingField.rightGoalLine)
        {
            goalScored(GAME_TEAM_RED);
        } else if (ball.getPositionX() < playingField.leftGoalLine)
        {
            goalScored(GAME_TEAM_BLUE);
        }
    }

    function goalScored(scoreTeam)
    {
        sound.playCheer();
        var gameEnd = false;
        
        if (scoreTeam == GAME_TEAM_RED)
        {
            teamScores.red += 1;
            gameEnd = teamScores.red >= gameOptions.goalLimit;
        }
        else
        {
            teamScores.blue += 1;
            gameEnd = teamScores.blue >= gameOptions.goalLimit;
        }
        hud.updateScore(teamScores);

        if (gameEnd || isOverTime)
        {
            endGame(scoreTeam, true);
        }
        else
        {
            hud.showMessage(scoreTeam + " team scores!", scoreTeam == "red" ? "#D24E4E" : "#3A85CC", 5);
            switchGameState("afterGoal", scoreTeam == "red" ? "blue" : "red");
        }
    }

    function endGame(winner, byGoal)
    {
        if (winner !== undefined)
        {
            sound.playCheer();
            hud.showMessage(winner + " wins the game!",
                winner == "red" ? "#D24E4E" : "#3A85CC");
            if (byGoal)
            {
                switchGameState("afterGoal", undefined);
            }
        }
        else
        {
            switchGameState("ended");
            sound.playEnd();
            hud.showMessage("DRAW!", "white");
        }
    }

    function updateTimer(deltaTime)
    {
        gameTimer.update(deltaTime);
        if (!gameTimer.isOvertime()) {
            return;
        }
        if (teamScores.red > teamScores.blue) {
            endGame(GAME_TEAM_RED);
            return;
        } 
        if (teamScores.red < teamScores.blue) {
            endGame(GAME_TEAM_BLUE);
            return;
        }
        if (gameOptions.allowDraw) {
            endGame();
            return;
        }
        if (drawnOverTime) {
            return;
        }
        drawnOverTime = true;
        hud.showMessage("Overtime!", "red", 2);
    }

    function begin() {

    }

    function update(deltaTime) {
        recorder.recordTick();
        updatePlayers();
        checkDistanceKicks();
        updateTimer(deltaTime);
        hud.update();
        checkGoal();
    }

    function end() {

    }

    return {
        name: "running",
        begin: begin,
        update: update,
        end: end
    };
}