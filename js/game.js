var game = function() {
    var currentKick = undefined;
    var ball;
    var currentGameState = GAME_STATE.PAUSED;
    var playerList = [];
    var blueScorePanel = document.getElementById(SCORE_PANEL_BLUE);
    var redScorePanel = document.getElementById(SCORE_PANEL_RED);
    var messagePanel = document.getElementById(MESSAGE_PANEL);
    var engine;
    var playingField;

    var teamScores = {
      red: 0,
      blue: 0
    }

    function pawnTouchesBall(pawn, ball) {
      playingField.hideBarrier();
      if (pawn.isKicking) {
        doKick(pawn, ball);
      }
    }

    function doKick(pawn, ball) {
      currentKick = {
        force: Matter.Vector.mult(Matter.Vector.normalise(
          Matter.Vector.sub(ball.position, pawn.position)),PLAYER_KICK_FORCE),
        ball: ball
      };
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

    function showMessage(text, color, duration) {
      drawMessage(text, color);
      if (duration !== undefined) {
        window.setTimeout(function() {
          hideMessage();
        }, duration * 1000);
      }
    }

    function showMessageQueue(messages) {
      var message = messages.shift();
      drawMessage(message.text, message.color);
      window.setTimeout(function() {
        hideMessage();
        if (messages.length > 0) {
          showMessageQueue(messages);
        }
      }, message.duration * 1000);
    }

    function drawMessage(text, color) {
      messagePanel.style.visibility="visible";
      messagePanel.innerText = text;
      if (color !== undefined) {
        messagePanel.style.color = color;
      }
      else {
        messagePanel.style.color = "white";
      }
    }

    function hideMessage() {
      messagePanel.style.visibility="hidden";
    }

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
      showMessage(scoreTeam + " team scores!",
        scoreTeam == "red"?"#D24E4E":"#3A85CC", 5);
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

    function checkDistanceKicks() {
      for (var i = 0; i < engine.world.bodies.length; i++) {
        if (engine.world.bodies[i].isKicking) {
          var diffVector = Matter.Vector.sub(
            ball.getPosition(), engine.world.bodies[i].position);

          if (Matter.Vector.magnitudeSquared(diffVector) < 1600) {
            playingField.hideBarrier();
            doKick(engine.world.bodies[i], ball.getBody());
          }
        }
      }
    }

    function update() {
      if (currentGameState == GAME_STATE.RUNNING) {
        updateInputs();
        checkDistanceKicks();
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
      setGameStateDelayed(GAME_STATE.RUNNING, 3);
      showMessageQueue([
        { text: "3", duration: 1 },
        { text: "2", duration: 1 },
        { text: "1", duration: 1 },
        { text: "GO!", duration: 1 }
      ]);
    };

    function initMatter() {
      // create a Matter.js engine
      engine = Matter.Engine.create({
        render: {
          element: document.body,
          canvas: document.getElementById("playingField")
        }
      });

      engine.render.options.wireframes = false;
      engine.render.options.background = "#007500";
      engine.render.options.showAngleIndicator = false;
      engine.render.options.showCollisions = false;

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
