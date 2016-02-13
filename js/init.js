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
