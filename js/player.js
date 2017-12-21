var Player = function (engine, controller, team, pawnCount)
{
    var bodies = [];

    controller.setMapping(PLAYER_INPUT_MAPPINGS[
        pawnCount == 1 ? "onePawn" : "twoPawns"
    ]);

    function createBody(position)
    {
        return Matter.Bodies.circle(position.x, position.y, PLAYER_RADIUS, {
            restitution: PLAYER_RESTITUTION,
            mass: PLAYER_MASS,
            friction: PLAYER_FRICTION,
            inertia: PLAYER_INERTIA,
            friction: PLAYER_FRICTION,
            collisionFilter: {
                category: CATEGORY.PLAYER,
                mask: CATEGORY.BALL | CATEGORY.PLAYER
            },
            isPlayer: true,
            isKicking: false,
            hasKicked: false,
            energy: 100,
            team: team,
            isExhausted: false
        });
    }

    function clearBodies()
    {
        for (var i = 0; i < bodies.length; i++)
        {
            HtmlRenderer.removePlayer(bodies[i]);
            Matter.World.remove(engine.world, bodies[i]);
        }
    }

    function clearBodies()
    {
        for (var i = 0; i < bodies.length; i++)
        {
            HtmlRenderer.removePlayer(bodies[i]);
            Matter.World.remove(engine.world, bodies[i]);
        }
        bodies = [];
    }

    function reset(positions)
    {
        clearBodies();
        for (var i = 0; i < positions.length; i++)
        {
            var body = createBody(positions[i]);
            HtmlRenderer.addPlayer(body, team, positions[i].label);
            bodies.push(body);
            Matter.World.add(engine.world, body);
        }
    }

    function updateBody(bodyIndex)
    {
        var body = bodies[bodyIndex];

        if (body.hasKicked) {
            if (!controller.get("kicking" + bodyIndex)) {
                body.hasKicked = false;
            }
        }
        else {
            body.isKicking = controller.get("kicking" + bodyIndex);
        }
        
        body.isBoosting = controller.get("boost" + bodyIndex);
        
        var input = controller.get("input" + bodyIndex);
        var vect = Matter.Vector.create(input.x, input.y);
        if (Matter.Vector.magnitudeSquared(vect) > 1)
        {
            vect = Matter.Vector.normalise(vect);
        }
        
        if (body.isBoosting && body.energy > 0 && !body.isExhausted)
        {
            vect = Matter.Vector.mult(vect, PLAYER_BOOSTENERGY);
            body.energy -= 0.4;
            if (body.energy <= 0)
            {
                body.energy = 0;
                body.isExhausted = true;
            }
        }
        else {
            var multiplier = 1;
            if (Matter.Vector.magnitudeSquared(body.velocity) < 0.2) {
                multiplier = 3;
            }
            body.energy += (0.08 * multiplier);
            if (body.energy >= 100)
            {
                body.energy = 100;
                if (body.isExhausted) {
                    body.isExhausted = false;
                }
                
            }
        }

        // Apply force to body if stick is out of dead zone.
        if (Matter.Vector.magnitude(vect) > PLAYER_INPUT_DEAD_ZONE)
        {
            body.latestVect = vect;
            Matter.Body.applyForce(body, body.position, Matter.Vector.mult(
                vect, body.isKicking ? PLAYER_MOVE_FORCE_KICKING : PLAYER_MOVE_FORCE));
        }

        body.render.strokeStyle = (body.isKicking) ?
            PLAYER_RENDER_STROKESTYLE_KICKING : PLAYER_RENDER_STROKESTYLE_IDLE;

        body.render.lineWidth = body.isKicking ?
            PLAYER_RENDER_LINEWIDTH_KICKING : PLAYER_RENDER_LINEWIDTH_IDLE;

        body.frictionAir = (body.isKicking) ?
            PLAYER_FRICTION_AIR_KICKING : PLAYER_FRICTION_AIR;
    }
    
    function update()
    {
        for (var i = 0; i < bodies.length; i++)
        {
            updateBody(i);
        }
    }

    return {
        clearBodies: clearBodies,
        reset: reset,
        update: update,
        team: team,
        pawnCount: pawnCount,
        controller: controller
    }
};
