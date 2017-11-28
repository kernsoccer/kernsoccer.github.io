var OptionsMenu = function (menu)
{
    var btnOptions = document.getElementById("btnOptions");
    var btnCloseOptions = document.getElementById("closeOptions");
    var optionsMenuPanel = document.getElementById("options");
    var fieldLines = document.querySelector("body .field .lines");

    /**
     * Option controls
     */
    var goalLimitInput = document.getElementById("goalLimit");
    var timeLimitInput = document.getElementById("timeLimit");
    var allowDrawInput = document.getElementById("allowDraw");
    var themeInput = document.getElementById("theme");

    function setFieldTheme(theme) {
        var THEMEPREFIX = 'theme-';

        for (var i = 0; i < fieldLines.classList.length; i++) {
            var className = fieldLines.classList[i];

            if (className.startsWith(THEMEPREFIX)) {
                fieldLines.classList.remove(className);
                break;
            }
        }

        fieldLines.classList.add(THEMEPREFIX + theme);
    }

    function hide()
    {
        optionsMenuPanel.style.display = "none";
        document.body.style.cursor = "none";
        menu.show();
    }

    function show()
    {
        menu.hide();
        optionsMenuPanel.style.display = "inherit";
        document.body.style.cursor = "auto";
    }

    function getGameOptions()
    {
        var options = {
            allowDraw: allowDrawInput.checked,
            goalLimit: (goalLimitInput.value != "") ? goalLimitInput.value : Number.POSITIVE_INFINITY,
            timeLimit: (timeLimitInput.value != "") ? timeLimitInput.value * 60 : Number.POSITIVE_INFINITY,
            startingTeam: GAME_TEAM_RED,
            fieldTheme: themeInput.value
        };

        return options;
    }

    function init()
    {
        btnOptions.addEventListener('click', function ()
        {
            show();
        });

        btnCloseOptions.addEventListener('click', function ()
        {
            hide();
        });
    }
    return {
        init: init,
        getGameOptions: getGameOptions
    };
}
