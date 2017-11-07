var Recorder = function (world, sound)
{
    var playerBodies = [];
    var currentIndex = -1;
    var ballBody;
    var playbackDone = false;
    var playedTicks = 0;


    for (var i = 0; i < world.bodies.length; i++)
    {
        if (world.bodies[i].isPlayer)
        {
            playerBodies.push(world.bodies[i]);
        }
        else if (world.bodies[i].isBall)
        {
            ballBody = world.bodies[i];
        }
    }

    var recording = [];

    function recordTick()
    {
        currentIndex++;
        var players = [];
        for (var i = 0; i < playerBodies.length; i++)
        {
            players.push({
                x: playerBodies[i].position.x,
                y: playerBodies[i].position.y,
                isKicking: playerBodies[i].isKicking
            });
        }

        var tick = {
            players: players,
            ballX: ballBody.position.x,
            ballY: ballBody.position.y,
            sounds: []
        };

        if (recording.length < 600)
        {
            recording.push(tick);
        }
        else
        {
            if (currentIndex == 600)
                currentIndex = 0;
            recording[currentIndex] = tick;
        }
    }

    function recordSound(snd)
    {
        recording[currentIndex].sounds.push(snd);
    }

    function playTick()
    {
        currentIndex++;

        if (currentIndex == 600 || currentIndex == recording.length)
        {
            currentIndex = 0;
        }

        if (playedTicks < 480 && playedTicks < recording.length)
        {
            var tick = recording[currentIndex];

            for (var i = 0; i < tick.players.length; i++)
            {
                playerBodies[i].isKicking = tick.players[i].isKicking;

                Matter.Body.setPosition(
                    playerBodies[i],
                    Matter.Vector.create(tick.players[i].x, tick.players[i].y));
            }

            Matter.Body.setPosition(
                ballBody,
                Matter.Vector.create(tick.ballX, tick.ballY));

            for (var i = 0; i < tick.sounds.length; i++)
            {
                sound.play(tick.sounds[i], true);
            }

            playedTicks++;
        }
        else
        {
            playbackDone = true;
        }
    }

    function isDone()
    {
        return playbackDone;
    }

    recordTick();

    return {
        recordTick: recordTick,
        playTick: playTick,
        isDone: isDone,
        recordSound: recordSound
    };
};
