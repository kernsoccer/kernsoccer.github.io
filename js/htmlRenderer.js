var HtmlRenderer = {
  var drawingObjects = {};

  function createDrawingObject(body) {
    debugger;
    return {};
  };

  create: function() {
    return { controller: HtmlRenderer };
  },

  world: function(engine) {
    var bodies = engine.world.bodies;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (bodes[i].isPlayer) {
        if (drawingObjects[bodies[i]] === undefined) {
          drawingObjects[bodies[i].id] = createDrawingObject(bodies[i]);
        }
      }
    }
  }
}
