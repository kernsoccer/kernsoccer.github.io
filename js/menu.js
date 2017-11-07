var Menu = function (startFunction) {
  var menuPanel = document.getElementById("menu");
  var goalLimitInput = document.getElementById("goalLimit");
  var timeLimitInput = document.getElementById("timeLimit");
  var allowDrawInput = document.getElementById("allowDraw");
  var noTeamPanel = document.getElementById("noTeam");
  var blueTeamPanel = document.getElementById("blueTeam");
  var redTeamPanel = document.getElementById("redTeam");

  var redTeam = [];
  var blueTeam = [];
  var noTeam = [];

  var playPressed = false;

  var gamepads = [
    {
      index: 0,
      team: "none",
      connected: false,
      x: 0,
      button: false,
      double: false,
      panel: document.getElementById("gamepad0")
    },
    {
      index: 1,
      team: "none",
      connected: false,
      x: 0,
      button: false,
      double: false,
      panel: document.getElementById("gamepad1")
    },
    {
      index: 2,
      team: "none",
      connected: false,
      x: 0,
      button: false,
      double: false,
      panel: document.getElementById("gamepad2")
    },
    {
      index: 3,
      team: "none",
      connected: false,
      x: 0,
      button: false,
      double: false,
      panel: document.getElementById("gamepad3")
    }
  ];

  function hide() {
    menuPanel.style.visibility = "hidden";
    document.body.style.cursor = "none";
  }

  function show() {
    playPressed = false;
    menuPanel.style.visibility = "visible";
    document.body.style.cursor = "auto";
  }

  function updateGamepad(gamepad, gamepadState) {
    if (gamepadState === undefined) {
      if (gamepad.connected) {
        gamepad.connected = false;
        removeGamepad(gamepad);
      }
      return;
    }

    if(gamepadState.buttons.length < 2) {
      return;
    }

    if (!gamepad.connected) {
      gamepad.connected = true;
      addGamepad(gamepad);
    }

    if (gamepadState.axes[0] > 0.8 && gamepad.x < 0.8) {
      if (gamepad.team == GAME_TEAM_RED) {
        switchPanel(gamepad.panel, noTeamPanel);
        gamepad.team = "none";
      } else if (gamepad.team == "none") {
        switchPanel(gamepad.panel, blueTeamPanel);
        gamepad.team = GAME_TEAM_BLUE;
      }
    }
    else if (gamepadState.axes[0] < -0.8 && gamepad.x > -0.8) {
      if (gamepad.team == GAME_TEAM_BLUE) {
        switchPanel(gamepad.panel, noTeamPanel);
        gamepad.team = "none";
      } else if (gamepad.team == "none") {
        switchPanel(gamepad.panel, redTeamPanel);
        gamepad.team = GAME_TEAM_RED;
      }
    }

    if (gamepadState.buttons[0].pressed && !gamepad.button) {
      gamepad.double = !gamepad.double;
      if (gamepad.double) {
        gamepad.panel.classList.add("double");
      }
      else {
        gamepad.panel.classList.remove("double");
      }
    }

    gamepad.x = gamepadState.axes[0];
    gamepad.button = gamepadState.buttons[0].pressed;
  }

  function update() {
    var gamepadStates = ControllerHelper.getControllerStates();
    
    for (var i = 0; i < gamepads.length; i++) {
      updateGamepad(gamepads[i], gamepadStates[i]);
      if(!gamepads[i].connected) {
        continue;
      }
      if (!playPressed && gamepadStates[i] !== undefined && gamepadStates[i].buttons[PLAYER_INPUT_PAUSE].pressed) {
        playPressed = true;
        startGame();
        return;
      }
    }
  }

  function switchPanel(panel, container) {
    panel.parentNode.removeChild(panel);
    container.appendChild(panel);
  }

  function addGamepad(gamepad) {
    gamepad.panel.style.visibility = "inherit";
  }

  function removeGamepad(gamepad) {
    gamepad.panel.style.visibility = "hidden";
  }

  function startGame() {
    var players = [];
    for (var i = 0; i < gamepads.length; i++) {
      if (gamepads[i].connected && gamepads[i].team != "none") {
        players.push({
          gamePadIndex: i,
          team: gamepads[i].team,
          pawnCount: gamepads[i].double ? 2 : 1
        });
      }
    }
    if (players.length == 0) {
      return;
    }
    hide();
    startFunction({
      allowDraw: allowDrawInput.checked,
      goalLimit: (goalLimitInput.value != "")
        ? goalLimitInput.value : Number.POSITIVE_INFINITY,
      timeLimit: (timeLimitInput.value != "")
        ? timeLimitInput.value * 60 : Number.POSITIVE_INFINITY,
      startingTeam: GAME_TEAM_RED,
      players: players
    });
  }

  return {
    hide: hide,
    show: show,
    update: update
  };
}
