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
engine.render.options.wireframes = false;
engine.render.options.background = "#007500";
engine.render.canvas.width = 1920;
engine.render.canvas.height = 1080;
engine.world.gravity.y = 0;


var circle = Bodies.circle(450,300,20,{
  restitution: 0.4,
  mass: 10,
  intertia: Number.POSITIVE_INFINITY,
  render: {
    fillStyle: "red",
    strokeStyle: "black",
    lineWidth: 4
  }
});

var circle2 = Bodies.circle(500,250,20,{
  restitution: 0.4,
  render: {
    fillStyle: "blue",
    strokeStyle: "black",
    lineWidth: 4
  }
});

var ball = Bodies.circle(700,500,15,{
  restitution: 0.4,
  render: {
    fillStyle: "white",
    strokeStyle: "black",
    lineWidth: 4
  }
});

Matter.Body.applyForce(circle, circle.position, Matter.Vector.create(0.01, 0.01));

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [circle, circle2, ball, ground]);

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
      console.log(vect);
      Matter.Body.applyForce(circle, circle.position, Matter.Vector.mult(vect,0.01));
    }
    Bodies

  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
