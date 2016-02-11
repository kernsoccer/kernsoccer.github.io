var Player = function (positionX, positionY, team, padIdx) {
  var body = Bodies.circle(positionX,positionY,20,{
    restitution: 0.4,
    mass: 10,
    frictionAir: 0.1,
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

      // Apply force to body if it's above min-value.
      if (Matter.Vector.magnitude(vect) > 0.1) {
        Matter.Body.applyForce(body, body.position, Matter.Vector.mult(vect,0.01));
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
