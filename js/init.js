
game.init();
game.start({
  allowDraw: false,
  duration: 180,
  goalLimit: 0,
  startingTeam: GAME_TEAM_RED,
  players: [
    {
      gamePadIndex: 1,
      team: GAME_TEAM_BLUE,
      pawnCount: 2
    },
    {
      gamePadIndex: 2,
      team: GAME_TEAM_RED,
      pawnCount: 2
    }
  ]
});
