import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

/*

class ProLocoClient {
  constructor (rootElement, { playerID } = {}) {
    this.client = Client({
      game,
      multiplayer: SocketIO({ server: 'localhost:8000' }),
      playerID
    })
    this.client.start()
    this.rootElement = rootElement
    this.boardElement = document.getElementById('board')
    this.createBoard()
    this.attachListeners()
    this.client.subscribe(state => this.update(state))
  }

  attachListeners () {
    let currentCard = -1
    let top = false
    const handleCardClick = event => {
      this.rootElement.querySelectorAll('.card').forEach(x => {
        x.classList.remove('selected')
      })
      currentCard = parseInt(event.currentTarget.id.split('-')[1])
      event.currentTarget.classList.add('selected')
      top = event.currentTarget.querySelector('.up').contains(event.target)
    }
    const handleEventClick = event => {
      if (currentCard !== -1) {
        const eventId = parseInt(event.currentTarget.id.split('-')[1])
        this.client.moves.playCard(currentCard, eventId, top)
        currentCard = -1
      }
    }
    this.rootElement.querySelectorAll('.card').forEach(x => {
      x.onclick = handleCardClick
    })
    this.boardElement.querySelectorAll(`#events-${this.client.playerID}.event`).forEach(x => {
      x.onclick = handleEventClick
    })
  }
}

const appElement = document.getElementById('app')
const playerIDs = ['0', '1']
const boardElement = document.createElement('div')
boardElement.id = 'board'
appElement.append(boardElement)
playerIDs.map(playerID => {
  return new ProLocoClient(rootElement, { playerID })
}) */
