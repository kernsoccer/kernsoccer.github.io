var playingField = function() {
  var FIELD_WIDTH = 1700;
  var FIELD_HEIGHT = 950;
  var GOAL_SIZE = 200;
  var CIRCLE_SIZE = 250;
  var CIRCLE_PARTS = 20;

  var CIRCLE_RADIUS = CIRCLE_SIZE / 2;
  var CIRCLE_INNER_RADIUS = CIRCLE_RADIUS -2;
  var LEFT_OFFSET = (SCREEN_WIDTH-FIELD_WIDTH)/2;
  var RIGHT_OFFSET = SCREEN_WIDTH - LEFT_OFFSET;

  var TOP_OFFSET = (SCREEN_HEIGHT-FIELD_HEIGHT)/2;
  var BOTTOM_OFFSET = SCREEN_HEIGHT - TOP_OFFSET;

  var OPTIONS_DEFAULT = { isStatic: true };
  var OPTIONS_GOAL_POST = {
    isStatic: true,
    collisionFilter: {
      category: CATEGORY.PLAYER,
      mask: CATEGORY.BALL | CATEGORY.PLAYER
    }
  };
  var OPTIONS_FIELD_LINE = {
    isStatic: true,
    collisionFilter: {
      category: CATEGORY.RESTRICT_BALL,
      mask: CATEGORY.BALL
    }
  };

  var leftCircle, rightCircle, middleLine;

  function createRect(vertices, options){
    var position = Matter.Vertices.centre(vertices);
    return Matter.Bodies.fromVertices(position.x, position.y, vertices, options,false,0.01,0);
  };

  function createWalls() {
    // top wall
    World.add(engine.world, createRect([
      { x: 0, y: 0 },
      { x: SCREEN_WIDTH, y: 0 },
      { x: SCREEN_WIDTH, y: -10 },
      { x: 0, y: -10 }
    ], OPTIONS_DEFAULT));
    // bottom wall
    World.add(engine.world, createRect([
      { x: 0, y: SCREEN_HEIGHT },
      { x: SCREEN_WIDTH, y: SCREEN_HEIGHT },
      { x: SCREEN_WIDTH, y: SCREEN_HEIGHT+10 },
      { x: 0, y: SCREEN_HEIGHT+10 }
    ], OPTIONS_DEFAULT));
    // left wall
    World.add(engine.world, createRect([
      { x: 0, y: 0 },
      { x: 0, y: SCREEN_HEIGHT },
      { x: -10, y: SCREEN_HEIGHT },
      { x: -10, y: 0 }
    ], OPTIONS_DEFAULT));
    // right wall
    World.add(engine.world, createRect([
      { x: SCREEN_WIDTH, y: 0 },
      { x: SCREEN_WIDTH, y: SCREEN_HEIGHT },
      { x: SCREEN_WIDTH+10, y: SCREEN_HEIGHT },
      { x: SCREEN_WIDTH+10, y: 0 }
    ], OPTIONS_DEFAULT));
  }

  function createField() {
    // top
    World.add(engine.world, createRect([
      {x: 0,y:0 },
      {x: LEFT_OFFSET,y:TOP_OFFSET},
      {x: RIGHT_OFFSET,y:TOP_OFFSET},
      {x: SCREEN_WIDTH, y: 0 }
    ],OPTIONS_FIELD_LINE));
    // bottom
    World.add(engine.world, createRect([
      {x: 0,y:SCREEN_HEIGHT },
      {x: LEFT_OFFSET,y:BOTTOM_OFFSET},
      {x: RIGHT_OFFSET,y:BOTTOM_OFFSET},
      {x: SCREEN_WIDTH, y: SCREEN_HEIGHT }
    ],OPTIONS_FIELD_LINE));
    // left top
    World.add(engine.world, createRect([
      {x: 0,y: 0 },
      {x: LEFT_OFFSET,y:TOP_OFFSET},
      {x: LEFT_OFFSET,y: SCREEN_HEIGHT/2 - GOAL_SIZE/2}
    ],OPTIONS_FIELD_LINE));
    // left bottom
    World.add(engine.world, createRect([
      {x: 0,y: SCREEN_HEIGHT },
      {x: LEFT_OFFSET,y:BOTTOM_OFFSET},
      {x: LEFT_OFFSET,y: SCREEN_HEIGHT/2 + GOAL_SIZE/2}
    ],OPTIONS_FIELD_LINE));
    // right top
    World.add(engine.world, createRect([
      {x: SCREEN_WIDTH,y: 0 },
      {x: RIGHT_OFFSET,y: TOP_OFFSET},
      {x: RIGHT_OFFSET,y: SCREEN_HEIGHT/2 - GOAL_SIZE/2}
    ],OPTIONS_FIELD_LINE));
    // right bottom
    World.add(engine.world, createRect([
      {x: SCREEN_WIDTH,y: SCREEN_HEIGHT },
      {x: RIGHT_OFFSET,y: BOTTOM_OFFSET},
      {x: RIGHT_OFFSET,y: SCREEN_HEIGHT/2 + GOAL_SIZE/2}
    ],OPTIONS_FIELD_LINE));

    // left posts
    World.add(engine.world, Bodies.circle(LEFT_OFFSET,SCREEN_HEIGHT/2 - GOAL_SIZE/2,10, OPTIONS_GOAL_POST));
    World.add(engine.world, Bodies.circle(LEFT_OFFSET,SCREEN_HEIGHT/2 + GOAL_SIZE/2,10, OPTIONS_GOAL_POST));

    // right posts
    World.add(engine.world, Bodies.circle(RIGHT_OFFSET,SCREEN_HEIGHT/2 - GOAL_SIZE/2,10, OPTIONS_GOAL_POST));
    World.add(engine.world, Bodies.circle(RIGHT_OFFSET,SCREEN_HEIGHT/2 + GOAL_SIZE/2,10, OPTIONS_GOAL_POST));
  }

  function createMiddle() {
    rightCircle = Matter.Composite.create();
    leftCircle = Matter.Composite.create();
    middleLine = Matter.Composite.create();

    // circles to restrict middle at kick off
    var interval = 100/CIRCLE_PARTS;
    for (var i = 0; i < CIRCLE_PARTS; i++) {
      var percentage = (interval * i) / 100;
      var angle = Math.PI * percentage;
      var x1 = Math.sin(angle) * CIRCLE_RADIUS;
      var x2 = Math.sin(angle) * CIRCLE_INNER_RADIUS;
      var y1 = Math.cos(angle) * CIRCLE_RADIUS;
      var y2 = Math.cos(angle) * CIRCLE_INNER_RADIUS;

      var nextpercentage = (interval * (i+1)) / 100;
      var nextAngle = Math.PI * nextpercentage;
      var nextx1 = Math.sin(nextAngle) * CIRCLE_RADIUS;
      var nextx2 = Math.sin(nextAngle) * CIRCLE_INNER_RADIUS;
      var nexty1 = Math.cos(nextAngle) * CIRCLE_RADIUS;
      var nexty2 = Math.cos(nextAngle) * CIRCLE_INNER_RADIUS;

      Matter.Composite.add(rightCircle, createRect([
        { x: SCREEN_WIDTH/2 + x1, y: SCREEN_HEIGHT/2 + y1 },
        { x: SCREEN_WIDTH/2 + nextx1, y: SCREEN_HEIGHT/2+ nexty1 },
        { x: SCREEN_WIDTH/2 + nextx2, y: SCREEN_HEIGHT/2+ nexty2 },
        { x: SCREEN_WIDTH/2 + x2, y: SCREEN_HEIGHT/2 + y2 }
      ], OPTIONS_DEFAULT));
      Matter.Composite.add(leftCircle, createRect([
        { x: SCREEN_WIDTH/2 - x1, y: SCREEN_HEIGHT/2 - y1 },
        { x: SCREEN_WIDTH/2 - nextx1, y: SCREEN_HEIGHT/2 - nexty1 },
        { x: SCREEN_WIDTH/2 - nextx2, y: SCREEN_HEIGHT/2 - nexty2 },
        { x: SCREEN_WIDTH/2 - x2, y: SCREEN_HEIGHT/2 - y2 }
      ], OPTIONS_DEFAULT));
    };

    // middle line
    Matter.Composite.add(middleLine, createRect([
      { x: SCREEN_WIDTH/2 - 1, y: 0 },
      { x: SCREEN_WIDTH/2 + 1, y: 0 },
      { x: SCREEN_WIDTH/2 + 1, y: SCREEN_HEIGHT/2 - CIRCLE_RADIUS },
      { x: SCREEN_WIDTH/2 - 1, y: SCREEN_HEIGHT/2 - CIRCLE_RADIUS }
    ], OPTIONS_DEFAULT));
    Matter.Composite.add(middleLine, createRect([
      { x: SCREEN_WIDTH/2 - 1, y: SCREEN_HEIGHT },
      { x: SCREEN_WIDTH/2 + 1, y: SCREEN_HEIGHT },
      { x: SCREEN_WIDTH/2 + 1, y: SCREEN_HEIGHT/2 + CIRCLE_RADIUS },
      { x: SCREEN_WIDTH/2 - 1, y: SCREEN_HEIGHT/2 + CIRCLE_RADIUS }
    ], OPTIONS_DEFAULT));

    World.add(engine.world, leftCircle);
    World.add(engine.world, rightCircle);
    World.add(engine.world, middleLine);
  }

  function createNets() {
    var particleOptions = {
      friction: 0.05,
      mass: 0.5,
      frictionStatic: 0.1,
      render: {
        fillStyle: "grey",
        strokeStyle: "black",
        lineWidth: 1
      },
      collisionFilter: {
        category: CATEGORY.RESTRICT_BALL,
        mask: CATEGORY.BALL
      }
    };
    var contraintOptions = {
      stiffness: 0.05,
      render: {
        visible: false
      }
    }

    var leftnet = Matter.Composites.softBody(LEFT_OFFSET - GOAL_SIZE/20 * 9, SCREEN_HEIGHT/2 - GOAL_SIZE/2 - GOAL_SIZE/20, 5, 11, 0, 0, true, GOAL_SIZE/20, particleOptions, contraintOptions);
    var removeBodies = [];
    leftnet.bodies[4].isStatic = true;
    leftnet.bodies[4].render.visible = false;
    leftnet.bodies[54].isStatic = true;
    leftnet.bodies[54].render.visible = false;
    for (var i = 5; i < 10 * 5; i++) {
      if (i % 5 != 0) {
        removeBodies.push(leftnet.bodies[i]);
      }
    }
    Matter.Composite.remove(leftnet, removeBodies);
    World.add(engine.world, leftnet);

    var rightnet = Matter.Composites.softBody(RIGHT_OFFSET - GOAL_SIZE/20 + GOAL_SIZE/40, SCREEN_HEIGHT/2 - GOAL_SIZE/2 - GOAL_SIZE/20, 5, 11, 0, 0, true, GOAL_SIZE/20, particleOptions, contraintOptions);
    removeBodies = [];
    rightnet.bodies[0].isStatic = true;
    rightnet.bodies[0].render.visible = false;
    rightnet.bodies[50].isStatic = true;
    rightnet.bodies[50].render.visible = false;
    for (var i = 5; i < 10 * 5; i++) {
      if (i % 5 != 4) {
        removeBodies.push(rightnet.bodies[i]);
      }
    }
    Matter.Composite.remove(rightnet, removeBodies);
    World.add(engine.world, rightnet);
  }

  var barrierActive = false;
  function showLeftBarrier() {
    barrierActive = true;
    for (var i = 0; i < middleLine.bodies.length; i++) {
      middleLine.bodies[i].collisionFilter.category = 1;
    }
    for (var i = 0; i < rightCircle.bodies.length; i++) {
      rightCircle.bodies[i].collisionFilter.category = 0;
      leftCircle.bodies[i].collisionFilter.category = 1;
    }
  }

  function showRightBarrier() {
    barrierActive = true;
    for (var i = 0; i < middleLine.bodies.length; i++) {
      middleLine.bodies[i].collisionFilter.category = 1;
    }
    for (var i = 0; i < rightCircle.bodies.length; i++) {
      rightCircle.bodies[i].collisionFilter.category = 1;
      leftCircle.bodies[i].collisionFilter.category = 0;
    }
  }

  function hideBarrier() {
    if (barrierActive) {
      barrierActive = false;
      for (var i = 0; i < middleLine.bodies.length; i++) {
        middleLine.bodies[i].collisionFilter.category = 0;
      }
      for (var i = 0; i < rightCircle.bodies.length; i++) {
        rightCircle.bodies[i].collisionFilter.category = 0;
        leftCircle.bodies[i].collisionFilter.category = 0;
      }
    }
  }

  function init() {
    createWalls();
    createNets();
    createField();
    createMiddle();
  }

  return {
    leftTeamLine: SCREEN_WIDTH/2 - FIELD_WIDTH/4,
    rightTeamLine: SCREEN_WIDTH/2 + FIELD_WIDTH/4,
    leftGoalLine: LEFT_OFFSET,
    rightGoalLine: RIGHT_OFFSET,
    showLeftBarrier: showLeftBarrier,
    showRightBarrier: showRightBarrier,
    hideBarrier: hideBarrier,
    init: init
  };
}();
