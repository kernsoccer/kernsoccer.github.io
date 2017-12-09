var Ball = function (engine)
{
    var body;

    function createBall()
    {
        return Matter.Bodies.circle(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, BALL_RADIUS, {
            restitution: BALL_RESTITUTION,
            mass: BALL_MASS,
            friction: BALL_FRICTION,
            inertia: BALL_INERTIA,
            collisionFilter: {
                category: CATEGORY.BALL,
                mask: CATEGORY.PLAYER | CATEGORY.RESTRICT_BALL
            },
            isBall: true,
            label: "ball"
        });
    }

    function getBody()
    {
        return body;
    }

    function getPosition()
    {
        return body.position;
    }

    function getPositionX()
    {
        return body.position.x;
    }

    function reset()
    {
        if (body !== undefined)
            Matter.World.remove(engine.world, body);
        body = createBall();
        HtmlRenderer.setBall(body);
        Matter.World.add(engine.world, body);
    }

    return {
        reset: reset,
        // Todo: refactor this to only get body and make it an attribute
        getPositionX: getPositionX,
        getPosition: getPosition,
        getBody: getBody
    }
};
