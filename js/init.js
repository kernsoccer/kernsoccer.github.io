
game.init();
game.start({
  allowDraw: false,
  timeLimit: 10,
  goalLimit: Number.POSITIVE_INFINITY,
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
