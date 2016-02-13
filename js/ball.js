var Ball = function (positionX, positionY) {
  World.add(engine.world, Bodies.circle(700,500,15,{
    restitution: 0.4,
    mass: 1,
    intertia: Number.POSITIVE_INFINITY,
    collisionFilter: {
      category: CAT_BALL,
      mask: CAT_PLAYER | CAT_RESTRICT_BALL
    },
    render: {
      fillStyle: "white",
      strokeStyle: "black",
      lineWidth: 4
    },
    isBall: true
  }));

  return {
  }
};
