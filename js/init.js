
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

engine.render.options.wireframes = false;
engine.render.options.background = "#007500";
engine.render.options.showAngleIndicator = false;
engine.render.options.showCollisions = true;

engine.render.canvas.width = SCREEN_WIDTH;
engine.render.canvas.height = SCREEN_HEIGHT;
engine.world.gravity.y = 0;
