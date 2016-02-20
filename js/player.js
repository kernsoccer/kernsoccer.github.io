var Player = function (gamePadIndex, team, pawnCount) {
  var MASS = 2;
  var RESTITUTION = 0.4;
  var FRICTION_AIR = 0.02;
  var FORCE = 0.001;
  var DEAD_ZONE = 0.2;

  var INPUT_OPTIONS = [
    {
      axesX: 0,
      axesY: 1,
      kickers: [0,4,6]
    },
    {
      axesX: 2,
      axesY: 3,
      kickers: [5,7]
    }
  ]

  var bodies = [];
  function createBody(position) {
    return Bodies.circle(position.x, position.y, 20, {
      restitution: RESTITUTION,
      mass: MASS,
      frictionAir: FRICTION_AIR,
      render: {
        fillStyle: team,
        strokeStyle: "black",
        lineWidth: 4
      },
      collisionFilter: {
        category: CATEGORY.PLAYER,
        mask: CATEGORY.BALL | CATEGORY.PLAYER
      },
      isPlayer: true,
      isKicking: false
    });
  }

  function reset(positions) {
    for (var i = 0; i < bodies.length; i++) {
      World.remove(engine.world, bodies[i]);
    }
    bodies = [];
    for (var i = 0; i < positions.length; i++) {
      var body = createBody(positions[i]);
      bodies.push(body);
      World.add(engine.world, body);
    }
  }

  function updateBody(gamePadState, prevButtonState, body, inputOptions) {
    var x = gamePadState.axes[inputOptions.axesX];
    var y = gamePadState.axes[inputOptions.axesY];
    var currentButtonState = [];
    var newButtonPressed = false, anyButtonPressed = false;
    for (var i = 0; i < inputOptions.kickers.length; i++) {
      currentButtonState[inputOptions.kickers[i]] = gamePadState.buttons[inputOptions.kickers[i]].pressed;
      if (gamePadState.buttons[inputOptions.kickers[i]].pressed) {
        anyButtonPressed = true;
        if (!prevButtonState[inputOptions.kickers[i]]) {
          newButtonPressed = true;
        }
      }
    }
    
    body.isKicking = (newButtonPressed || (anyButtonPressed && body.isKicking));

    var vect = Matter.Vector.create(x,y);
    // Apply force to body if stick is out of dead zone.
    if (Matter.Vector.magnitude(vect) > DEAD_ZONE) {
      Matter.Body.applyForce(body, body.position, Matter.Vector.mult(vect,body.isKicking?FORCE/2:FORCE));
    }

    body.render.strokeStyle = (body.isKicking) ? "white" : "black";
    body.frictionAir = (body.isKicking) ? FRICTION_AIR * 2 : FRICTION_AIR;
    return currentButtonState;
  }
  var prevButtonStates = [[],[]];
  function update(gamePadState) {
    if (gamePadState !== undefined) {
      for (var i = 0; i < bodies.length; i++) {
        prevButtonStates[i] = updateBody(gamePadState, prevButtonStates[i], bodies[i], INPUT_OPTIONS[i]);
      }
    }
  }

  return {
    reset: reset,
    update: update,
    team: team,
    pawnCount: pawnCount,
    gamePadIndex: gamePadIndex
  }
};
