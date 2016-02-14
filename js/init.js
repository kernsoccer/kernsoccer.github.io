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

var SCREEN_WIDTH = 1920;
var SCREEN_HEIGHT = 1080;

engine.render.options.wireframes = false;
engine.render.options.background = "#007500";
engine.render.options.showAngleIndicator = false;
engine.render.options.showCollisions = true;

engine.render.canvas.width = SCREEN_WIDTH;
engine.render.canvas.height = SCREEN_HEIGHT;
engine.world.gravity.y = 0;


// CATEGORIES:
var CAT_BALL = 1;
var CAT_PLAYER = 2;
var CAT_RESTRICT_BALL = 4;
