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
  Bodies.rectangle(50, 1080/2, 100, 1080, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
    }
  }),
  Bodies.rectangle(1870, 1080/2, 100, 1080, {
    isStatic: true,
    collisionFilter: {
      category: CAT_RESTRICT_BALL,
      mask: CAT_BALL
    },
    render: {
      visible: engine.render.options.wireframes
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
  }
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

// add all of the bodies to the world
World.add(engine.world, [circle, circle2, ball]);



// run the engine
Engine.run(engine);

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
      circle.render.strokeStyle = "white";
    }
    else {
      circle.render.strokeStyle = "black";
    }
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
