const { Server, Origins } = require('boardgame.io/server');
const { game } = require('./game');

const server = Server({
    games: [game],
    origins: [Origins.LOCALHOST],
});

server.run(8000);