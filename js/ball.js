var Ball = function () {
  var body;

  function createBall() {
    return Bodies.circle(SCREEN_WIDTH/2,SCREEN_HEIGHT/2,BALL_RADIUS,{
      restitution: BALL_RESTITUTION,
      mass: BALL_MASS,
      friction: BALL_FRICTION,
      inertia: BALL_INERTIA,
      collisionFilter: {
        category: CATEGORY.BALL,
        mask: CATEGORY.PLAYER | CATEGORY.RESTRICT_BALL
      },
      render: {
        fillStyle: BALL_RENDER_FILLSTYLE,
        strokeStyle: BALL_RENDER_STROKESTYLE,
        lineWidth: BALL_RENDER_LINEWIDTH
      },
      isBall: true,
      label: "ball"
    });
  }

  function getPositionX() {
    return body.position.x;
  }

  function reset() {
    if (body !== undefined)
      World.remove(engine.world, body);
    body = createBall();
    World.add(engine.world, body)
  }

  return {
    reset: reset,
    getPositionX: getPositionX
  }
};
