var game = Game();
game.init();
//game.start({"allowDraw":true,"goalLimit":"5","timeLimit":180,"players":[{"gamePadIndex":0,"team":"red","pawnCount":1},{"gamePadIndex":1,"team":"blue","pawnCount":1}]});
if(window.location.href.indexOf('?start') != -1) {
    game.start({"allowDraw":true,"goalLimit":"5","timeLimit":180,"players":[{"gamePadIndex":0,"team":"red","pawnCount":1},{"gamePadIndex":1,"team":"blue","pawnCount":1}]});
}