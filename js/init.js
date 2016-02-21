
//for (var i = 0; i < navigator.getGamepads()[1].buttons.length; i++) { console.log(i + ": " + navigator.getGamepads()[1].buttons[i].pressed); }

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
var CATEGORY = {
  BALL: 1,
  PLAYER: 2,
  RESTRICT_BALL: 4
}

var GAME_STATE = {
  RUNNING: 0,
  PAUSED: 1,
  WARMUP: 2,
  AFTER_GOAL: 3
}
