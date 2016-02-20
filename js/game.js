var game = function() {
    var currentKick = undefined;
    var ball = Ball();
    var currentGameState = GAME_STATE.PAUSED;
    var playerList = [];

    function pawnTouchesBall(pawn, ball) {
      playingField.hideBarrier();
      if (pawn.isKicking) {
        pawn.render.strokeStyle = "black";
        pawn.isKicking = false;
        currentKick = {
          force: Matter.Vector.mult(Matter.Vector.normalise(Matter.Vector.sub(ball.position, pawn.position)),0.035),
          ball: ball
        };
      }
    }

    function registerHandlers() {
      Matter.Events.on(engine, "collisionActive collisionStart", function(event) {
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
          Matter.Body.applyForce(currentKick.ball, currentKick.ball.position, currentKick.force);
          currentKick = undefined;
        }
      });
    };

    function update() {
      var gamepadState = navigator.getGamepads();

      for (var i = 0; i < playerList.length; i++) {
        playerList[i].update(gamepadState[playerList[i].gamePadIndex]);
      }
      // request next animation frame
      requestAnimationFrame(update);
    };

    function resetTeam(players, positionX) {
      var count = 0;
      for (var i = 0; i < players.length; i++) {
        count += players[i].pawnCount;
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

    function start(options) {
      var redTeam = [], blueTeam = [];

      for (var i = 0; i < options.players.length; i++) {
        var player = Player(
          options.players[i].gamePadIndex,
          options.players[i].team,
          options.players[i].pawnCount);
        playerList.push(player);

        if (player.team == "red") {
          redTeam.push(player);
        }
        else {
          blueTeam.push(player);
        }
      }

      resetTeam(redTeam, playingField.leftTeamLine );
      resetTeam(blueTeam, playingField.rightTeamLine );
      playingField.showRightBarrier();
      ball.reset();
      currentGameState = GAME_STATE.WARMUP;
    };

    function prepare() {
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
  players: [
    {
      gamePadIndex: 0,
      team: "red",
      pawnCount: 2
    },
    {
      gamePadIndex: 1,
      team: "blue",
      pawnCount: 2
    }
  ]
});
