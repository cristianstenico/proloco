import { Server, Origins } from 'boardgame.io/server'
import game from './game.js'

const server = Server({
  games: [game],
  origins: [
    Origins.LOCALHOST_IN_DEVELOPMENT,
    'https://proloco.netlify.app'
  ]
})
const PORT = process.env.PORT || 8000
server.run(PORT)
