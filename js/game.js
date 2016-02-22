var game = function() {
    var currentKick = undefined;
    var ball;
    var currentGameState = GAME_STATE.PAUSED;
    var playerList = [];
    var blueScorePanel = document.getElementById(SCORE_PANEL_BLUE);
    var redScorePanel = document.getElementById(SCORE_PANEL_RED);
    var engine;
    var playingField;

    var teamScores = {
      red: 0,
      blue: 0
    }

    function pawnTouchesBall(pawn, ball) {
      playingField.hideBarrier();
      if (pawn.isKicking) {
        pawn.render.strokeStyle = PLAYER_RENDER_STROKESTYLE_IDLE;
        pawn.isKicking = false;
        currentKick = {
          force: Matter.Vector.mult(Matter.Vector.normalise(
            Matter.Vector.sub(ball.position, pawn.position)),PLAYER_KICK_FORCE),
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
            else {
              debugger;
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
      }, GAME_AFTER_GOAL_TIME);
    }

    function checkGoal() {
      //TODO: replace by constant
      if (ball.getPositionX() > playingField.rightGoalLine) {
        teamScores.red += 1;
        goalScored(GAME_TEAM_RED,GAME_TEAM_BLUE);
        //TODO: replace by constant
      } else if (ball.getPositionX() < playingField.leftGoalLine) {
        teamScores.blue += 1;
        goalScored(GAME_TEAM_BLUE,GAME_TEAM_RED);
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

      var offset = GAME_PLAYER_KICKOFF_DISTANCE * (count-1) / 2;
      for (var i = 0; i < players.length; i++) {
        var positions = [];
        for (var p = 0; p < players[i].pawnCount; p++) {
          positions.push({
            x: positionX,
            y: SCREEN_HEIGHT/2 - offset + GAME_PLAYER_KICKOFF_DISTANCE * --count
          });
        }
        players[i].reset(positions);
      }
    }

    function prepareKickoff(team) {
      resetTeam(GAME_TEAM_RED, playingField.leftTeamLine );
      resetTeam(GAME_TEAM_BLUE, playingField.rightTeamLine );

      if (team == GAME_TEAM_RED) {
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
          engine,
          options.players[i].gamePadIndex,
          options.players[i].team,
          options.players[i].pawnCount);
        playerList.push(player);
      }

      prepareKickoff(options.startingTeam);
      currentGameState = GAME_STATE.WARMUP;
      setGameStateDelayed(GAME_STATE.RUNNING, 2);
    };

    function initMatter() {
      // create a Matter.js engine
      engine = Matter.Engine.create({
        render: {
          element: document.body,
          canvas: document.getElementById("playingField")
        }
      });

      engine.render.options.wireframes = true;
      engine.render.options.background = "#007500";
      engine.render.options.showAngleIndicator = false;
      engine.render.options.showCollisions = true;
      engine.render.options.showDebug = true;

      engine.render.canvas.width = SCREEN_WIDTH;
      engine.render.canvas.height = SCREEN_HEIGHT;
      engine.world.gravity.y = 0;
      Matter.Engine.run(engine);
    }

    function init() {
      teamScores = {
        red: 0,
        blue: 0
      }
      initMatter();
      playingField = PlayingField(engine);
      playingField.init();
      ball = Ball(engine);
      updateScore();
      registerHandlers();
      requestAnimationFrame(update);
    };

    return {
      start: start,
      init:init
    }
}();
