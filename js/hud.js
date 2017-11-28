var Hud = function ()
{
    var blueScorePanel = document.getElementById(SCORE_PANEL_BLUE);
    var redScorePanel = document.getElementById(SCORE_PANEL_RED);
    var messagePanel = document.getElementById(MESSAGE_PANEL);
    var minutesPanel = document.getElementById("minutes");
    var secondsPanel = document.getElementById("seconds");
    
    var messageTimer;

    function showMessageQueue(messages)
    {
        window.clearTimeout(messageTimer);

        var message = messages.shift();

        drawMessage(message.text, message.color);

        messageTimer = window.setTimeout(function ()
        {
            hideMessage();

            if (messages.length > 0)
            {
                showMessageQueue(messages);
            }
        }, message.duration * 1000);
    }

    

    function drawMessage(text, color)
    {
        messagePanel.style.visibility = "visible";
        messagePanel.innerText = text;

        if (color !== undefined)
        {
            messagePanel.style.color = color;
        }
        else
        {
            messagePanel.style.color = "white";
        }
    }

    function showMessage(text, color, duration)
    {
        window.clearTimeout(messageTimer);
        drawMessage(text, color);

        if (duration !== undefined)
        {
            messageTimer = window.setTimeout(
                    function ()
                    {
                        hideMessage();
                    },
                duration * 1000);
        }
    }

    function hideMessage()
    {
        messagePanel.style.visibility = "hidden";
    }

    function updateScore(teamScores)
    {
        redScorePanel.innerText = teamScores.red;
        blueScorePanel.innerText = teamScores.blue;
    }

    function updateTime(totalSeconds)
    {
        minutesPanel.innerText = Math.floor(totalSeconds / 60);

        var seconds = totalSeconds % 60;

        secondsPanel.innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    return {
        showMessage: showMessage,
        hideMessage: hideMessage,
        showMessageQueue: showMessageQueue,
        updateTime: updateTime,
        updateScore: updateScore
    };
};
