var Ball = function () {
  var body = createBall();

  function createBall() {
    return Bodies.circle(SCREEN_WIDTH/2,SCREEN_HEIGHT/2,15,{
      restitution: 0.7,
      mass: 1,
      friction: 0,
      inertia: Number.POSITIVE_INFINITY,
      collisionFilter: {
        category: CATEGORY.BALL,
        mask: CATEGORY.PLAYER | CATEGORY.RESTRICT_BALL
      },
      render: {
        fillStyle: "white",
        strokeStyle: "black",
        lineWidth: 4
      },
      isBall: true
    });
  }

  function reset() {
    if (body !== undefined)
      World.remove(engine.world, body);
    body = createBall();
    World.add(engine.world, body)
  }

  return {
    reset: reset
  }
};
