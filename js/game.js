var Game = function ()
{
    var gameStates = {};
    var currentGameState = undefined;
    var playerList = [];
    var gameTimer = GameTimer();
    var hud = Hud(gameTimer);
    var sound = Sound();
    var controllerManager = ControllerManager();
    
    
    var lastUpdate;

    var currentKick = undefined;

    var menu;
    var optionsMenu;
    var runner;
    var playingField;
    var ball;
    var engine;
    var recorder;

    var gameOptions = {
        allowDraw: true,
        goalLimit: Number.POSITIVE_INFINITY,
        timeLimit: Number.POSITIVE_INFINITY
    };

    var teamScores = {
        red: 0,
        blue: 0
    }

    function pawnTouchesBall(pawn, ball)
    {
        if (pawn.isKicking)
        {
            doKick(pawn, ball);
        }
    }

    function doKick(pawn, ball)
    {
        if (currentKick !== undefined) 
        {
            return;
        }
        pawn.isKicking = false;
        pawn.hasKicked = true;
        sound.playKick();
        currentKick = {
            direction: Matter.Vector.normalise(
                Matter.Vector.sub(ball.position, pawn.position)),
            ball: ball
        };
    }

    function registerHandlers()
    {
        Matter.Events.on(engine, "collisionActive collisionStart",
            function (event)
            {
                for (var i = 0; i < event.pairs.length; i++)
                {
                    if (event.pairs[i].bodyA.isBall && event.pairs[i].bodyB.isPlayer)
                    {
                        pawnTouchesBall(event.pairs[i].bodyB, event.pairs[i].bodyA);
                    }
                    else if (event.pairs[i].bodyB.isBall && event.pairs[i].bodyA.isPlayer)
                    {
                        pawnTouchesBall(event.pairs[i].bodyA, event.pairs[i].bodyB);
                    }
                }
            });

        Matter.Events.on(engine, "beforeUpdate", function (e)
        {
            if (currentKick !== undefined)
            {
                var speed = Matter.Vector.magnitude(currentKick.ball.velocity);
                var newVelocity = Matter.Vector.mult(currentKick.direction, speed);
                Matter.Body.setVelocity(currentKick.ball, newVelocity);
                var force = Matter.Vector.mult(currentKick.direction, PLAYER_KICK_FORCE);
                Matter.Body.applyForce(
                    currentKick.ball,
                    currentKick.ball.position,
                    force);
                currentKick = undefined;
            }
        });
    };

    function checkDistanceKicks()
    {
        for (var i = 0; i < engine.world.bodies.length; i++)
        {
            if (engine.world.bodies[i].isKicking)
            {
                var diffVector = Matter.Vector.sub(
                    ball.getPosition(), engine.world.bodies[i].position);

                if (Matter.Vector.magnitudeSquared(diffVector) < 1600)
                {
                    doKick(engine.world.bodies[i], ball.getBody());
                }
            }
        }
    }

    function update(time)
    {
        var deltaTime = time - lastUpdate;
        controllerManager.update();
        currentGameState.update(deltaTime);
        HtmlRenderer.update();
        lastUpdate = time;
        // request next animation frame
        requestAnimationFrame(update);
    };

    function checkMenuReturn()
    {
        for (var i = 0; i < controllerManager.controllers.length; i++)
        {
            if (controllerManager.controllers[i].get("menu"))
            {
                switchGameState("menu");
                return;
            }
        }
    }

    function resetTeam(team, positionX)
    {
        var players = [];
        var count = 0;
        // select all players from the team and count their pawns
        for (var i = 0; i < playerList.length; i++)
        {
            if (playerList[i].team == team)
            {
                players.push(playerList[i]);
                count += playerList[i].pawnCount;
            }
        }

        var offset = GAME_PLAYER_KICKOFF_DISTANCE * (count - 1) / 2;
        for (var i = 0; i < players.length; i++)
        {
            var positions = [];
            for (var p = 0; p < players[i].pawnCount; p++)
            {
                positions.push({
                    label: count,
                    x: positionX,
                    y: SCREEN_HEIGHT / 2 - offset + GAME_PLAYER_KICKOFF_DISTANCE * --count

                });
            }
            players[i].reset(positions);
        }
    }

    function start(options)
    {
        runner.enabled = true;
        teamScores.red = teamScores.blue = 0;
        
        gameTimer.setTime(options.timeLimit);
        hud.updateScore(teamScores);
        hud.update();

        for (var i = 0; i < playerList.length; i++)
        {
            playerList[i].clearBodies();
        }

        playerList = [];

        for (var i = 0; i < options.players.length; i++)
        {
            var player = Player(
                engine,
                controllerManager.controllers[options.players[i].gamePadIndex],
                options.players[i].team,
                options.players[i].pawnCount);

            playerList.push(player);
        }

        isOverTime = false;
        gameOptions.allowDraw = options.allowDraw;
        gameOptions.goalLimit = options.goalLimit;
        gameOptions.timeLimit = options.timeLimit;
        switchGameState("warmup", options.startingTeam);
        
    };

    function switchGameState(stateName, switchOptions) {
        currentGameState.end();
        window.location.hash = stateName;
        currentGameState = gameStates[stateName];
        currentGameState.begin(switchOptions);
    }

    function initMatter()
    {
        engine = Matter.Engine.create();
        engine.world.gravity.y = 0;
        runner = Matter.Runner.create();
        Matter.Engine.run(runner, engine);
    }

    function addState(gameState) {
        gameStates[gameState.name] = gameState;
    }

    function updatePlayers()
    {
        for (var i = 0; i < playerList.length; i++)
        {
            if (playerList[i].controller.get("pause"))
            {
                switchGameState("paused", playerList[i].controller, currentGameState.name);
                return;
            }
            playerList[i].update();
        }
    }

    function init()
    {
        teamScores = {
            red: 0,
            blue: 0
        }

        initMatter();
        playingField = PlayingField(engine);
        playingField.init();
        ball = Ball(engine);
        
        hud.updateScore(teamScores);
        menu = Menu(controllerManager.controllers, start);
        menu.init();
        recorder = Recorder(engine.world, sound);
        sound.setRecorder(recorder);
        registerHandlers();

        addState(AfterGoalState(
            recorder, 
            updatePlayers, 
            checkDistanceKicks,
            switchGameState
        ));
        addState(EndedState(
            recorder, 
            updatePlayers, 
            checkDistanceKicks, 
            checkMenuReturn
        ));
        addState(KickoffState(
            recorder,
            sound,
            playingField, 
            ball, 
            resetTeam, 
            updatePlayers, 
            checkDistanceKicks,
            switchGameState
        ));
        addState(MenuState(
            menu
        ));
        addState(PausedState(
            hud, 
            runner, 
            switchGameState
        ));
        addState(ReplayState(
            recorder,
            controllerManager.controllers, 
            runner, 
            sound, 
            switchGameState
        ));
        addState(RunningState(
            recorder, 
            sound, 
            hud, 
            teamScores, 
            gameOptions, 
            ball, 
            playingField, 
            gameTimer,
            updatePlayers, 
            checkDistanceKicks,
            switchGameState
        ));
        addState(WarmupState(
            hud, 
            sound, 
            playingField,
            ball,
            resetTeam,
            switchGameState
        ));

        currentGameState = gameStates["menu"];

        lastUpdate = performance.now();
        update(lastUpdate);
    };

    

    return {
        start: start,
        init: init
    }
};
