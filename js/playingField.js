var playingField = function() {
  var bodies = [Bodies.rectangle(1920/2, 10, 1920, 20, { isStatic: true }),
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
  })];

  function init() {
    World.add(engine.world, bodies);

  }

  return {
    init: init
  };
}();
