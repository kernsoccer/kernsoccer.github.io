var Player = function (positionX, positionY, team, padIdx) {
  var MASS = 2;
  var RESTITUTION = 0.4;
  var FRICTION_AIR = 0.02;
  var FORCE = 0.001;
  var DEAD_ZONE = 0.2;

  var body = Bodies.circle(positionX,positionY,20,{
    restitution: RESTITUTION,
    mass: MASS,
    frictionAir: FRICTION_AIR,
    intertia: Number.POSITIVE_INFINITY,
    render: {
      fillStyle: team,
      strokeStyle: "black",
      lineWidth: 4
    },
    collisionFilter: {
      category: CAT_PLAYER,
      mask: CAT_BALL | CAT_PLAYER
    },
    isPlayer: true,
    isKicking: false,
    canPress: true
  });
  World.add(engine.world, body);

  function update(gamePads) {
    var playerPad = gamePads[padIdx];
    if (playerPad !== undefined) {
      var x = playerPad.axes[0];
      var y = playerPad.axes[1];

      var vect = Matter.Vector.create(x,y);

      // Apply force to body if stick is out of dead zone.
      if (Matter.Vector.magnitude(vect) > DEAD_ZONE) {
        Matter.Body.applyForce(body, body.position, Matter.Vector.mult(vect,FORCE));
      }

      if (playerPad.buttons[0].pressed) {
        if (body.canPress) {
          body.isKicking = true;
          body.canPress = false;
        }
      }
      else {
        body.isKicking = false;
        body.canPress = true;
      }

      body.render.strokeStyle = (body.isKicking) ? "white" : "black";
    }
  }

  return {
    body: body,
    update: update
  }
};
