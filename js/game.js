var game = function() {

    var gameState = {
      MENU: 0,
      RUNNING: 1,
      PAUSED: 2
    }

    var currentKick = undefined;
    var ball = undefined;
    var currentGameState = gameState.MENU;
    var playerList = [];
    var activatedGamepads = {};

    function possibleKick(pawn, ball) {
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
            possibleKick(event.pairs[i].bodyB, event.pairs[i].bodyA);
          }
          else if (event.pairs[i].bodyB.isBall && event.pairs[i].bodyA.isPlayer) {
            possibleKick(event.pairs[i].bodyA, event.pairs[i].bodyB);
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
      var gamepads = navigator.getGamepads();

      if (currentGameState == gameState.MENU) {
        for (var i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            if (gamepads[i].buttons[1].pressed) {
              addPlayer(1800 - Math.random() * 900, Math.random() * 900, "red", i)
            }
            else if (gamepads[i].buttons[2].pressed) {
              addPlayer(Math.random() * 900, Math.random() * 900, "blue", i)
            }
          }
        }

        if (gamepads[0] && gamepads[0].buttons[0].pressed) {
          start();
        }
      }
      else {
        for (var i = 0; i < playerList.length; i++) {
          playerList[i].update(gamepads);
        }
      }

      requestAnimationFrame(update);
    }

    function addPlayer(x, y, team, gamepadIdx) {
      if (!activatedGamepads[gamepadIdx]) {
        activatedGamepads[gamepadIdx] = true;

        playerList.push(Player(x, y, team, gamepadIdx));
      }
    }
    function start() {
      Ball();
      currentGameState = gameState.RUNNING;
      playingField.showRightBarrier();
    }

    function prepare() {
      playingField.init();
      registerHandlers();
      requestAnimationFrame(update);
      Engine.run(engine);
    }

    return {
      start: start,
      pause:function() {
         currentGameState = gameState.PAUSED;
      },
      prepare:prepare,
      addPlayer: addPlayer
    }
}();


game.prepare();
game.addPlayer(500,400,"red",0);
game.start();
