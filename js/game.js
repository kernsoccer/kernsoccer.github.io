var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create a Matter.js engine
var engine = Engine.create({
  render: {
    element: document.body,
    canvas: document.getElementById("playingField")
  }
});

engine.render.options.wireframes = true;
engine.render.options.background = "#007500";
engine.render.canvas.width = 1920;
engine.render.canvas.height = 1080;
engine.world.gravity.y = 0;


// CATEGORIES:
var CAT_BALL = 1;
var CAT_PLAYER = 2;
var CAT_RESTRICT_BALL = 4;

// init game field
World.add(engine.world, [
  Bodies.rectangle(1920/2, 10, 1920, 20, { isStatic: true }),
  Bodies.rectangle(1920/2, 1070, 1920, 20, { isStatic: true }),
  Bodies.rectangle(10, 1080/2, 20, 1080, { isStatic: true }),
  Bodies.rectangle(1910, 1080/2, 20, 1080, { isStatic: true }),
  Bodies.rectangle(1920/2, 50, 1920, 100, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(1920/2, 1030, 1920, 100, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(25, 1080/2, 50, 1080, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(1895, 1080/2, 50, 1080, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(60, 1080/4, 120, 1080/3, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(60, 1080-1080/4, 120, 1080/3, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(1860, 1080/4, 120, 1080/3, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(1860, 1080-1080/4, 120, 1080/3, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.circle(120,450,10, {
    isStatic: true,
    collisionFilter: {
      category: CAT_PLAYER,
      mask: CAT_BALL | CAT_PLAYER
    }
  }),
  Bodies.circle(120,630,10, {
    isStatic: true,
    collisionFilter: {
      category: CAT_PLAYER,
      mask: CAT_BALL | CAT_PLAYER
    }
  }),
  Bodies.circle(1800,450,10, {
    isStatic: true,
    collisionFilter: {
      category: CAT_PLAYER,
      mask: CAT_BALL | CAT_PLAYER
    }
  }),
  Bodies.circle(1800,630,10, {
    isStatic: true,
    collisionFilter: {
      category: CAT_PLAYER,
      mask: CAT_BALL | CAT_PLAYER
    }
  })
]);

var ball = Bodies.circle(700,500,15,{
  restitution: 0.4,
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
  label: "ball"
});

var circle = Bodies.circle(450,300,20,{
  restitution: 0.4,
  mass: 10,
  frictionAir: 0.1,
  intertia: Number.POSITIVE_INFINITY,
  render: {
    fillStyle: "red",
    strokeStyle: "black",
    lineWidth: 4
  },
  collisionFilter: {
    category: CAT_PLAYER,
    mask: CAT_BALL | CAT_PLAYER
  }
});

var circle2 = Bodies.circle(500,250,20,{
  restitution: 0.4,
  mass: 10,
  frictionAir: 0.1,
  intertia: Number.POSITIVE_INFINITY,
  render: {
    fillStyle: "blue",
    strokeStyle: "black",
    lineWidth: 4
  },
  collisionFilter: {
    category: CAT_PLAYER,
    mask: CAT_BALL | CAT_PLAYER
  }
});
circle.isPlayer = true;
circle.isKicking = false;
circle2.isPlayer = true;
circle2.isKicking = false;
// add all of the bodies to the world
World.add(engine.world, [circle, circle2, ball]);



// run the engine
Engine.run(engine);
var kicking = false;
var canPress = true;

function update() {
  var gamepads = navigator.getGamepads();
  var pad = gamepads[0]
  if (pad !== undefined) {
    var x = pad.axes[0];
    var y = pad.axes[1];
    var vect = Matter.Vector.create(x,y);
    if (Matter.Vector.magnitude(vect) > 0.1) {
      Matter.Body.applyForce(circle, circle.position, Matter.Vector.mult(vect,0.01));
    }
    if (pad.buttons[0].pressed) {
      if (canPress) {
        kicking = true;
        canPress = false;
      }
    }
    else {
      canPress = true;

      kicking = false;
    }
    if (kicking)
      circle.render.strokeStyle = "white";
    else
      circle.render.strokeStyle = "black";
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

var currentKick = undefined;

function possibleKick(pawn, ball) {
  if (kicking) {
    circle.render.strokeStyle = "black";
    kicking = false;
    currentKick = Matter.Vector.mult(Matter.Vector.normalise(Matter.Vector.sub(ball.position, pawn.position)),0.035);
    console.log(currentKick);
  }
}

function beforeUpdateHandler(event) {
  if (currentKick !== undefined) {
    Matter.Body.applyForce(ball, ball.position, currentKick);
    currentKick = undefined;
  }
}

function collisionHandler(event) {
  for (var i = 0; i < event.pairs.length; i++) {
    if (event.pairs[i].bodyA == ball && event.pairs[i].bodyB.isPlayer)
    {
      possibleKick(event.pairs[i].bodyB, event.pairs[i].bodyA);
    }
    else if (event.pairs[i].bodyB == ball && event.pairs[i].bodyA.isPlayer) {
      possibleKick(event.pairs[i].bodyA, event.pairs[i].bodyB);
    }
  }
}

Matter.Events.on(engine, "collisionActive", collisionHandler);
Matter.Events.on(engine, "collisionStart", collisionHandler);
Matter.Events.on(engine, "beforeUpdate", beforeUpdateHandler);
