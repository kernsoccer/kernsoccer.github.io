var game = function() {
    var currentKick = undefined;
    var ball;
    var currentGameState = GAME_STATE.PAUSED;
    var playerList = [];
    var blueScorePanel = document.getElementById(SCORE_PANEL_BLUE);
    var redScorePanel = document.getElementById(SCORE_PANEL_RED);
    var messagePanel = document.getElementById(MESSAGE_PANEL);
    var minutesPanel = document.getElementById("minutes");
    var secondsPanel = document.getElementById("seconds");
    var allowDraw = true;
    var engine;
    var playingField;
    var lastUpdate;
    var updater;
    var timePlayed;
    var isOverTime = false;

    var goalLimit = 0;
    var timeLimit = Number.POSITIVE_INFINITY;

    var teamScores = {
      red: 0,
      blue: 0
    }

    function endKickoff() {
      if (currentGameState == GAME_STATE.KICKOFF) {
        playingField.hideBarrier();
        currentGameState = GAME_STATE.RUNNING;
      }
    }

    function pawnTouchesBall(pawn, ball) {
      endKickoff();
      if (pawn.isKicking) {
        doKick(pawn, ball);
      }
    }

    function doKick(pawn, ball) {
      pawn.isKicking = false;
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

      checkDistanceKicks();
    }

    function setGameStateDelayed(nextState, seconds) {
      window.setTimeout(function() {
        currentGameState = nextState;
      }, seconds * 1000);
    }

    function goalScored(scoreTeam) {
      var gameEnd = false;
      currentGameState = GAME_STATE.AFTER_GOAL;
      if (scoreTeam == GAME_TEAM_RED) {
        teamScores.red += 1;
        gameEnd = teamScores.red >= goalLimit;
      }
      else {
        teamScores.blue += 1;
        gameEnd = teamScores.blue >= goalLimit;
      }
      updateScore();
      if (gameEnd || isOverTime) {
        endGame(scoreTeam);
      }
      else {
        showMessage(scoreTeam + " team scores!",
          scoreTeam == "red"?"#D24E4E":"#3A85CC", 5);
        window.setTimeout(function() {
          prepareKickoff(scoreTeam == "red"?"blue":"red");
          currentGameState = GAME_STATE.KICKOFF;
        }, GAME_AFTER_GOAL_TIME);
      }
    }

    function endGame(winner) {
      currentGameState = GAME_STATE.ENDED;
      if (winner !== undefined) {
        showMessage(winner + " wins the game!",
          winner == "red"?"#D24E4E":"#3A85CC");
      }
      else {
        showMessage("DRAW!", "white");
      }
    }

    function checkGoal() {
      //TODO: replace by constant
      if (ball.getPositionX() > playingField.rightGoalLine) {
        goalScored(GAME_TEAM_RED);
        //TODO: replace by constant
      } else if (ball.getPositionX() < playingField.leftGoalLine) {
        goalScored(GAME_TEAM_BLUE);
      }
    }

    function checkDistanceKicks() {
      for (var i = 0; i < engine.world.bodies.length; i++) {
        if (engine.world.bodies[i].isKicking) {
          var diffVector = Matter.Vector.sub(
            ball.getPosition(), engine.world.bodies[i].position);

          if (Matter.Vector.magnitudeSquared(diffVector) < 1600) {
            endKickoff();
            doKick(engine.world.bodies[i], ball.getBody());
          }
        }
      }
    }

    function updateTimer(deltaTime) {
      var newTimePlayed = timePlayed + deltaTime;
      var totalSeconds = Math.floor(newTimePlayed / 1000);
      // if seconds changed we need to update our timer display
      if (Math.floor(newTimePlayed / 1000) != Math.floor(timePlayed / 1000)) {
        minutesPanel.innerText = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        secondsPanel.innerText = seconds < 10?"0"+seconds:seconds;
        console.log(Math.floor(newTimePlayed / 1000) % 60);
      }

      if (timeLimit == totalSeconds) {
        if (teamScores.red > teamScores.blue) {
          endGame(GAME_TEAM_RED);
        } else if (teamScores.red < teamScores.blue) {
          endGame(GAME_TEAM_BLUE);
        } else if (allowDraw) {
          endGame();
        }
        else if (!isOverTime) {
          isOverTime = true;
          showMessage("Overtime!", "red", 2);
        }
      }

      timePlayed = newTimePlayed;
    }

    function update(time) {
      var deltaTime = time - lastUpdate;

      if (currentGameState == GAME_STATE.RUNNING) {
        updateInputs();
        updateTimer(deltaTime);
        checkGoal();
      } else if (currentGameState == GAME_STATE.KICKOFF) {
        updateInputs();
      } else if (currentGameState == GAME_STATE.AFTER_GOAL) {
        updateInputs();
      } else if (currentGameState == GAME_STATE.ENDED) {
        updateInputs();
      }

      lastUpdate = time;
      // request next animation frame
      updater = requestAnimationFrame(update);
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

    // caution: kickoff is reversed!
    // because its easier as goalScored knows only the scoring team
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
      timePlayed = 0;
      isOverTime = false;
      allowDraw = options.allowDraw;
      goalLimit = options.goalLimit;
      timeLimit = options.timeLimit;
      prepareKickoff(options.startingTeam);
      currentGameState = GAME_STATE.WARMUP;
      setGameStateDelayed(GAME_STATE.KICKOFF, 3);
      showMessageQueue([
        { text: "3", duration: 1 },
        { text: "2", duration: 1 },
        { text: "1", duration: 1 },
        { text: "GO!", duration: 1 }
      ]);
      lastUpdate = performance.now();
      update(lastUpdate);
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
    };

    return {
      start: start,
      init:init
    }
}();
