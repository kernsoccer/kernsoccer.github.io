var Game = function ()
{
    var gameStates = {};
    var currentGameState = undefined;
    var playerList = [];
    var hud = Hud();
    var sound = Sound();
    var controllerManager = ControllerManager();
    var stateTimer;
    var lastUpdate;
    var timePlayed;
    var isOverTime = false;
    var currentKick = undefined;

    var beforePauseGameState;
    var pausingPlayer = undefined;

    var menu;
    var optionsMenu;
    var runner;
    var playingField;
    var ball;
    var engine;
    var recorder;

    var gameOptions = {
        allowDraw: true,
        allowBoost: true,
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

    function showMenu()
    {
        window.clearTimeout(stateTimer);
        switchGameState("menu");
    }

    function updateInputs()
    {
        for (var i = 0; i < playerList.length; i++)
        {
            if (playerList[i].controller.get("pause"))
            {
                pauseGame(playerList[i]);
                return;
            }
            playerList[i].update();
        }
    }

    function pauseGame(player)
    {
        beforePauseGameState = currentGameState.name;
        switchGameState("paused");
        pausingPlayer = player;
        hud.showMessage("PAUSED", "red");
        runner.enabled = false;
    }

    function updatePause()
    {
        if (!pausingPlayer.controller.isConnected())
        {
            continueGame();
            return;
        }
        if (pausingPlayer.controller.get("pause"))
        {
            continueGame();
            return;
        }
        if (pausingPlayer.controller.get("menu"))
        {
            hud.hideMessage();
            showMenu();
        }
    }

    function continueGame()
    {
        switchGameState(beforePauseGameState);
        runner.enabled = true;
        hud.hideMessage();
    }

    function goalScored(scoreTeam)
    {
        sound.playCheer();
        var gameEnd = false;
        switchGameState("afterGoal");
        if (scoreTeam == GAME_TEAM_RED)
        {
            teamScores.red += 1;
            gameEnd = teamScores.red >= gameOptions.goalLimit;
        }
        else
        {
            teamScores.blue += 1;
            gameEnd = teamScores.blue >= gameOptions.goalLimit;
        }
        hud.updateScore(teamScores);

        if (gameEnd || isOverTime)
        {
            endGame(scoreTeam, true);
        }
        else
        {
            hud.showMessage(scoreTeam + " team scores!", scoreTeam == "red" ? "#D24E4E" : "#3A85CC", 5);

            stateTimer = window.setTimeout(function ()
            {
                switchGameState("replay", scoreTeam == "red" ? "blue" : "red");
                runner.enabled = false;
            }, GAME_AFTER_GOAL_TIME);
        }
    }

    function endGame(winner, byGoal)
    {
        if (winner !== undefined)
        {
            sound.playCheer();
            hud.showMessage(winner + " wins the game!",
                winner == "red" ? "#D24E4E" : "#3A85CC");
            if (byGoal)
            {
                stateTimer = window.setTimeout(function ()
                {
                    switchGameState("replay", undefined);
                    runner.enabled = false;
                }, GAME_AFTER_GOAL_TIME);
            }
        }
        else
        {
            switchGameState("ended");
            sound.playEnd();
            hud.showMessage("DRAW!", "white");
        }
    }

    function checkGoal()
    {
        if (ball.getPositionX() > playingField.rightGoalLine)
        {
            goalScored(GAME_TEAM_RED);
        } else if (ball.getPositionX() < playingField.leftGoalLine)
        {
            goalScored(GAME_TEAM_BLUE);
        }
    }

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

    function updateTimer(deltaTime)
    {
        var newTimePlayed = timePlayed + deltaTime;
        var totalSeconds = Math.floor(newTimePlayed / 1000);
        // if seconds changed we need to update our timer display
        if (Math.floor(newTimePlayed / 1000) != Math.floor(timePlayed / 1000))
        {
            hud.updateTime(Math.abs(gameOptions.timeLimit-totalSeconds));
        }

        if (gameOptions.timeLimit == totalSeconds)
        {
            if (teamScores.red > teamScores.blue)
            {
                endGame(GAME_TEAM_RED);
            } else if (teamScores.red < teamScores.blue)
            {
                endGame(GAME_TEAM_BLUE);
            } else if (gameOptions.allowDraw)
            {
                endGame();
            }
            else if (!isOverTime)
            {
                isOverTime = true;
                hud.showMessage("Overtime!", "red", 2);
            }
        }

        timePlayed = newTimePlayed;
    }

    function checkCancel()
    {
        for (var i = 0; i < 4; i++)
        {
            if (controllerManager.controllers[i].get("cancel"))
            {
                return true;
            }
        }
        return false;
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
                showMenu();
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
        teamScores = {
            red: 0,
            blue: 0
        };
        hud.updateScore(teamScores);

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
        pausingGamepadIndex = -1;
        timePlayed = 0;

        hud.updateTime(options.timeLimit);

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
            updateInputs, 
            checkDistanceKicks
        ));
        addState(EndedState(
            recorder, 
            updateInputs, 
            checkDistanceKicks, 
            checkMenuReturn
        ));
        addState(KickoffState(
            recorder, 
            playingField, 
            ball, 
            resetTeam, 
            updateInputs, 
            checkDistanceKicks,
            switchGameState
        ));
        addState(MenuState(
            menu
        ));
        addState(PausedState(
            updatePause
        ));
        addState(ReplayState(
            recorder,
            checkCancel, 
            runner, 
            sound, 
            switchGameState
        ));
        addState(RunningState(
            recorder, 
            updateInputs, 
            checkDistanceKicks, 
            updateTimer, 
            checkGoal
        ));
        addState(WarmupState(
            hud, 
            sound, 
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
