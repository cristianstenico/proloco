import { Server, Origins } from 'boardgame.io/server'
import game from './game.js'

const server = Server({
  games: [game],
  origins: [
    'https://proloco.netlify.app',
    Origins.LOCALHOST_IN_DEVELOPMENT
  ]
})
const PORT = process.env.PORT || 8000
server.run(PORT)
