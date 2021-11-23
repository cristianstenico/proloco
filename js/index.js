import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import { LobbyClient, Client } from 'boardgame.io/client'
//
// import { SocketIO } from 'boardgame.io/multiplayer'
// import game from './game.js'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

/* eslint-disable no-new */
/* const rootElement = document.getElementById('app')

const lobbyClient = new LobbyClient({
  server: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''
})

function startMatch () {
  lobbyClient.createMatch(game.name, {
    numPlayers: parseInt(document.getElementById('numplayers').value)
  }).then(({ matchID }) => {

  })
}

function joinMatch (match, playerID) {
  lobbyClient.joinMatch(game.name, match, { playerID }).then(({ playerCredentials }) => {
    console.log(playerCredentials)
  })
}

lobbyClient.listGames().then(async games => {
  const { matches } = await lobbyClient.listMatches(games[0])
  rootElement.innerHTML = '<h1>Partite in corso:</h1><ul>'
  matches.forEach(m => {
    console.log(m)
    rootElement.innerHTML += '<li>' + m.matchID + ' - '
    m.players.forEach(p => {
      rootElement.innerHTML += `<a id="player-${m.matchID}-${p.id}">${p.id}</a> `
      document.getElementById(`player-${m.matchID}-${p.id}`).addEventListener('click', () => { joinMatch(m.matchID, p.id) }, true)
    })
    rootElement.innerHTML += '<li/>'
  })
  rootElement.innerHTML += '</ul>'
  rootElement.innerHTML += `<h2>Inizia una nuova Partita:</h2>
    <label>
      Numero giocatori
      <input id="numplayers" type="number" value="2">
    </label>
    <a id="startmatch">Inizia</a>`
  document.getElementById('startmatch').addEventListener('click', startMatch)
}).catch(console.error)

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

  update (state) {
    if (state === null) return
    if (state.ctx.gameover) {
      const resultElement = this.rootElement.querySelector('.result')
      if (state.ctx.gameover.win) {
        resultElement.innerHTML = 'YOU WIN!'
      } else {
        resultElement.innerHTML = 'YOU LOSE!'
      }
      return
    }
    this.createBoard()
    this.attachListeners()
  }

  createBoard () {
    let hands = ''
    let events = ''
    if (!this.client.getState()) return
    const isCurrent = this.client.playerID === this.client.getState().ctx.currentPlayer
    this.client.getState().G.hands[parseInt(this.client.playerID)].forEach(x => {
      let pre = ''
      if (x.up.pre.startsWith('A')) {
        pre += '<i class="fas fa-euro-sign"></i> ' + x.up.pre.substring(2)
      }
      if (x.up.pre.startsWith('B')) {
        pre += '<i class="fas fa-box"></i> ' + x.up.pre.substring(2)
      }
      if (x.up.pre.startsWith('C')) {
        pre += '<i class="fas fa-carrot"></i> ' + x.up.pre.substring(2)
      }
      if (x.up.pre.startsWith('events')) {
        pre += '<i class="fas fa-calendar-check"></i> ' + x.up.pre.substring(7)
      }
      let post = ''
      if (x.down.post.events) {
        post += '<i class="fas fa-calendar"></i> ' + x.down.post.events
      }
      hands += `<div class="card" id="card-${x.name}">
        <div class="up">
          <div class="pre">${pre}</div>
          ${x.up.values.A ? '<div class="a"><i class="fas fa-euro-sign"></i>' + x.up.values.A + '</div>' : ''}
          ${x.up.values.B ? '<div class="b"><i class="fas fa-box"></i>' + x.up.values.B + '</div>' : ''}
          ${x.up.values.C ? '<div class="c"><i class="fas fa-carrot"></i>' + x.up.values.C + '</div>' : ''}
        </div>
        <div class="down">
          <div class="a"><i class="fas fa-euro-sign"></i> ${x.down.values.A}</div>
          <div class="b"><i class="fas fa-box"></i> ${x.down.values.B}</div>
          <div class="c"><i class="fas fa-carrot"></i> ${x.down.values.C}</div>
          <div class="post">${post}</div>
        </div>
        <div class="id-card">${x.name}</div>
      </div> `
    })
    this.client.getState().G.events.forEach(event => {
      let cards = ''
      event.cards.forEach(card => {
        cards += `
          <div>
            ${card.A ? '<div class="a"><i class="fas fa-euro-sign"></i> ' + card.A + '</div>' : ''}
            ${card.B ? '<div class="b"><i class="fas fa-box"></i> ' + card.B + '</div>' : ''}
            ${card.C ? '<div class="c"><i class="fas fa-carrot"></i> ' + card.C + '</div>' : ''}
          </div>`
      })
      events += `
    <div class="event-wrapper">
        <div class="event" id="event-${event.event.name}">
          <div class="a"><i class="fas fa-euro-sign"></i> ${event.event.A}</div>
          <div class="b"><i class="fas fa-box"></i> ${event.event.B}</div>
          <div class="c"><i class="fas fa-carrot"></i> ${event.event.C}</div>
          <div class="people"><i class="fas fa-child"></i> ${event.event.people}</div>
          <div class="id-event">${event.event.name}</div>
        </div>
        <div class="cards">
          ${cards}
        </div>
      </div>
    `
    })
    if (isCurrent) {
      this.boardElement.innerHTML = `
    <div id="current-${this.client.playerID}"> <b>Eventi completati: ${this.client.getState().G.eventsFilled}</b></div>
      <div class="events" id="events-${this.client.playerID}">
        ${events}
      </div>
  `
    }
    this.rootElement.innerHTML = `
    <div class="hand ${isCurrent ? 'current-player' : ''}" >
      ${isCurrent ? '<h3>È il tuo turno</h3>' : ''}
          ${hands}
        </div>
    <div class="result"></div>
  `
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
