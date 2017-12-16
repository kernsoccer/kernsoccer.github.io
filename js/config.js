// HTML ELEMENT IDS //
var SCORE_PANEL_BLUE = "blueScore";
var SCORE_PANEL_RED = "redScore";
var MESSAGE_PANEL = "textMessage"

// SCREEN //
var SCREEN_WIDTH = 1920;
var SCREEN_HEIGHT = 1080;

// GAME //
var GAME_TEAM_RED = "red";
var GAME_TEAM_BLUE = "blue";
// time between ball entering the goal and replay starts
var GAME_AFTER_GOAL_TIME = 3000;
// the distance from middle where players are lined up at kickoff
var GAME_PLAYER_KICKOFF_DISTANCE = 100;

// FIELD //
var FIELD_WIDTH = 1700;
var FIELD_HEIGHT = 950;

var FIELD_LINE_RESTITUTION = 0.9;
var FIELD_OUTER_RESTITUTION = 0;

var FIELD_GOAL_SIZE = 200;
var FIELD_GOAL_RESTITUTION = 0.9;

var FIELD_NET_DEPTH = 50;
var FIELD_NET_WIDTH = 200;
var FIELD_NET_RESTITUTION = 0;
var FIELD_NET_RENDER_FILLSTYLE = "grey";

// size of the circle arround the kickoff point
var FIELD_CIRCLE_SIZE = 250;
// segments to use for the circle
var FIELD_CIRCLE_PARTS = 20;

var PLAYER_BOOSTENERGY = 1.5;

var ENERGY_DROWNING = 1.5;
var ENERGY_REGENERATION = 0.4;
var ENERGY_REGENERATION_OUTPOWERED = 0.2;


// PLAYER //
// PLAYER RENDER
var PLAYER_RENDER_STROKESTYLE_IDLE = "black";
var PLAYER_RENDER_STROKESTYLE_KICKING = "white";
var PLAYER_RENDER_LINEWIDTH_IDLE = 4;
var PLAYER_RENDER_LINEWIDTH_KICKING = 8;
// PLAYER PHYSICS
var PLAYER_RADIUS = 20;
var PLAYER_MASS = 2;
var PLAYER_FRICTION = 0;
var PLAYER_INERTIA = Number.POSITIVE_INFINITY;
var PLAYER_RESTITUTION = 0.0;
var PLAYER_FRICTION_AIR = 0.11;
var PLAYER_FRICTION_AIR_KICKING = 0.12;
var PLAYER_MOVE_FORCE = 0.0035;
var PLAYER_MOVE_FORCE_KICKING = 0.002;
// PLAYER INPUT
var PLAYER_KICK_FORCE = 0.035;
var PLAYER_INPUT_DEAD_ZONE = 0.2;
var PLAYER_INPUT_MAPPINGS = {
    menu: {
        start: {
            type: "button",
            buttons: [9],
            toggle: true
        },
        double: {
            type: "button",
            buttons: [0],
            toggle: true
        },
        menuLeft: {
            type: "axisbutton",
            axes: [0],
            threshold: -0.8,
            toggle: true
        },
        menuRight: {
            type: "axisbutton",
            axes: [0],
            threshold: 0.8,
            toggle: true
        }
    },
    onePawn: {
        input0: {
            type: "vector",
            xaxis: 0,
            yaxis: 1
        },
        kicking0: {
            type: "button",
            buttons: [0, 6],
            toggle: false
        },
        boost0: {
            type: "button",
            buttons: [2,4],
            toggle: false
        },
        pause: {
            type: "button",
            buttons: [9],
            toggle: true
        },
        cancel: {
            type: "button",
            buttons: [1],
            toggle: true
        },
        menu: {
            type: "button",
            buttons: [8],
            toggle: true
        }
    },
    twoPawns: {
        input0: {
            type: "vector",
            xaxis: 0,
            yaxis: 1
        },
        kicking0: {
            type: "button",
            buttons: [0, 6],
            toggle: false
        },
        boost0: {
            type: "button",
            buttons: [4],
            toggle: false
        },
        input1: {
            type: "vector",
            xaxis: 2,
            yaxis: 3
        },
        kicking1: {
            type: "button",
            buttons: [7],
            toggle: false
        },
        boost1: {
            type: "button",
            buttons: [5],
            toggle: false
        },
        pause: {
            type: "button",
            buttons: [9],
            toggle: true
        },
        cancel: {
            type: "button",
            buttons: [1],
            toggle: true
        },
        menu: {
            type: "button",
            buttons: [8],
            toggle: true
        }
    }
}

// BALL //
// BALL RENDER
var BALL_RENDER_FILLSTYLE = "white";
var BALL_RENDER_STROKESTYLE = "black";
var BALL_RENDER_LINEWIDTH = 4;
// BALL PHYSICS
var BALL_RADIUS = 15;
var BALL_RESTITUTION = 0;
var BALL_MASS = 1;
var BALL_FRICTION = 0;
var BALL_INERTIA = Number.POSITIVE_INFINITY;

// COLLISION CATEGORIES //
var CATEGORY = {
  BALL: 1,
  PLAYER: 2,
  RESTRICT_BALL: 4
}

// GAME STATES //
var GAME_STATE = {
  RUNNING: 0,
  KICKOFF: 1,
  PAUSED: 2,
  WARMUP: 3,
  AFTER_GOAL: 4,
  ENDED: 5,
  MENU: 6,
  REPLAY: 7,
  REPLAY_END: 8
}

/*
### MY LITTLE CONSOLE HELPERS ###

for (var i = 0; i < navigator.getGamepads()[0].buttons.length; i++) { console.log(i + ": " + navigator.getGamepads()[0].buttons[i].pressed); }
for (var i = 0; i < navigator.getGamepads()[1].buttons.length; i++) { console.log(i + ": " + navigator.getGamepads()[1].buttons[i].pressed); }
for (var i = 0; i < navigator.getGamepads()[2].buttons.length; i++) { console.log(i + ": " + navigator.getGamepads()[2].buttons[i].pressed); }
for (var i = 0; i < navigator.getGamepads()[3].buttons.length; i++) { console.log(i + ": " + navigator.getGamepads()[3].buttons[i].pressed); }
*/
