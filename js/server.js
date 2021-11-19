import { Server, Origins } from 'boardgame.io/server'
import game from './game.js'

const server = Server({
    games: [game],
    origins: [
        Origins.LOCALHOST_IN_DEVELOPMENT
    ],
});

server.run(8000, () => console.log('server running...'));