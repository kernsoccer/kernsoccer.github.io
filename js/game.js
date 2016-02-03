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

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);

var circle = Bodies.circle(450,300,20,{
  restitution: 0.4,
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
World.add(engine.world, [boxA, boxB, circle, circle2, ball, ground]);

// run the engine
Engine.run(engine);
