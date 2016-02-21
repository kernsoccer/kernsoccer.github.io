var game = function() {
    var currentKick = undefined;
    var ball = Ball();
    var currentGameState = GAME_STATE.PAUSED;
    var playerList = [];
    var blueScorePanel = document.getElementById("blueScore");
    var redScorePanel = document.getElementById("redScore");

    var teamScores = {
      red: 0,
      blue: 0
    }

    function pawnTouchesBall(pawn, ball) {
      playingField.hideBarrier();
      if (pawn.isKicking) {
        pawn.render.strokeStyle = "black";
        pawn.isKicking = false;
        currentKick = {
          force: Matter.Vector.mult(Matter.Vector.normalise(
            Matter.Vector.sub(ball.position, pawn.position)),0.035),
          ball: ball
        };
      }
    }

    function registerHandlers() {
      Matter.Events.on(engine, "collisionActive collisionStart",
        function(event) {
          for (var i = 0; i < event.pairs.length; i++) {
            if (event.pairs[i].bodyA.isBall && event.pairs[i].bodyB.isPlayer)
            {
              pawnTouchesBall(event.pairs[i].bodyB, event.pairs[i].bodyA);
            }
            else if (event.pairs[i].bodyB.isBall && event.pairs[i].bodyA.isPlayer) {
              pawnTouchesBall(event.pairs[i].bodyA, event.pairs[i].bodyB);
            }
          }
        });

      Matter.Events.on(engine, "beforeUpdate", function(e) {
        if (currentKick !== undefined) {
          Matter.Body.applyForce(
            currentKick.ball,
            currentKick.ball.position,
            currentKick.force);
          currentKick = undefined;
        }
      });
    };

    function updateScore() {
      redScorePanel.innerText = teamScores.red;
      blueScorePanel.innerText = teamScores.blue;
    }

    function updateInputs() {
      var gamepadState = navigator.getGamepads();

      for (var i = 0; i < playerList.length; i++) {
        playerList[i].update(gamepadState[playerList[i].gamePadIndex]);
      }
    }

    function setGameStateDelayed(nextState, seconds) {
      window.setTimeout(function() {
        currentGameState = nextState;
      }, seconds * 1000);
    }

    function goalScored(scoreTeam, otherTeam) {
      currentGameState = GAME_STATE.AFTER_GOAL;
      updateScore();
      window.setTimeout(function() {
        prepareKickoff(otherTeam);
        currentGameState = GAME_STATE.RUNNING;
      }, 2000);
    }

    function checkGoal() {
      if (ball.getPositionX() > playingField.rightGoalLine) {
        teamScores.red += 1;
        goalScored("red","blue");
      } else if (ball.getPositionX() < playingField.leftGoalLine) {
        teamScores.blue += 1;
        goalScored("blue","red");
      }
    }

    function update() {
      if (currentGameState == GAME_STATE.RUNNING) {
        updateInputs();
        checkGoal();
      } else if (currentGameState == GAME_STATE.WARMUP) {

      } else if (currentGameState == GAME_STATE.AFTER_GOAL) {
        updateInputs();
      }
      // request next animation frame
      requestAnimationFrame(update);
    };

    function resetTeam(team, positionX) {
      var players = [];
      var count = 0;
      // select all players from the team and count their pawns
      for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].team == team) {
          players.push(playerList[i]);
          count += playerList[i].pawnCount;
        }
      }

      var offset = 100 * (count-1) / 2;
      for (var i = 0; i < players.length; i++) {
        var positions = [];
        for (var p = 0; p < players[i].pawnCount; p++) {
          positions.push({
            x: positionX,
            y: SCREEN_HEIGHT/2 - offset + 100 * --count
          });
        }
        players[i].reset(positions);
      }
    }

    function prepareKickoff(team) {
      resetTeam("red", playingField.leftTeamLine );
      resetTeam("blue", playingField.rightTeamLine );

      if (team == "red") {
        playingField.showRightBarrier();
      }
      else {
        playingField.showLeftBarrier();
      }
      ball.reset();
    }


    function start(options) {
      for (var i = 0; i < options.players.length; i++) {
        var player = Player(
          options.players[i].gamePadIndex,
          options.players[i].team,
          options.players[i].pawnCount);
        playerList.push(player);
      }

      prepareKickoff(options.startingTeam);
      currentGameState = GAME_STATE.WARMUP;
      setGameStateDelayed(GAME_STATE.RUNNING, 2);
    };


    function prepare() {
      teamScores = {
        red: 0,
        blue: 0
      }
      updateScore();
      playingField.init();
      registerHandlers();
      requestAnimationFrame(update);
      Engine.run(engine);
    };

    return {
      start: start,
      prepare:prepare
    }
}();

game.prepare();
game.start({
  allowDraw: false,
  duration: 180,
  goalLimit: 0,
  startingTeam: "blue",
  players: [
    {
      gamePadIndex: 1,
      team: "blue",
      pawnCount: 2
    },
    {
      gamePadIndex: 2,
      team: "red",
      pawnCount: 2
    }
  ]
});
