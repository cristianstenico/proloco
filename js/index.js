import { Client } from 'boardgame.io/client'
import Proloco from './game.js'

/* eslint-disable no-new */

class ProLocoClient {
  constructor (rootElement) {
    this.client = Client({ game: Proloco })
    this.client.start()
    this.rootElement = rootElement
    this.createBoard()
    this.attachListeners()
    this.client.subscribe(state => this.update(state))
  }

  update (state) {
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
    this.client.getState().G.hands[parseInt(this.client.getState().ctx.currentPlayer)].forEach(x => {
      let pre = ''
      if (x.up.pre.A) {
        pre += '<i class="fas fa-euro-sign"></i> ' + x.up.pre.A.split('-').join(' ')
      }
      if (x.up.pre.B) {
        pre += '<i class="fas fa-box"></i> ' + x.up.pre.B.split('-').join(' ')
      }
      if (x.up.pre.C) {
        pre += '<i class="fas fa-carrot"></i> ' + x.up.pre.C.split('-').join(' ')
      }
      if (x.up.pre.events) {
        pre += '<i class="fas fa-calendar-check"></i> ' + x.up.pre.events.split('-').join(' ')
      }
      let post = ''
      if (x.down.post.events) {
        post += '<i class="fas fa-calendar"></i> ' + x.down.post.events
      }
      hands += `<div class="card" id="card-${x.name}">
        <div class="up">
          <div class="pre">${pre}</div>
          <div class="a"><i class="fas fa-euro-sign"></i> ${x.up.values.A}</div>
          <div class="b"><i class="fas fa-box"></i> ${x.up.values.B}</div>
          <div class="c"><i class="fas fa-carrot"></i> ${x.up.values.C}</div>
        </div>
        <div class="down">
          <div class="a"><i class="fas fa-euro-sign"></i> ${x.down.values.A}</div>
          <div class="b"><i class="fas fa-box"></i> ${x.down.values.B}</div>
          <div class="c"><i class="fas fa-carrot"></i> ${x.down.values.C}</div>
          <div class="post">${post}</div>
        </div>
        <div class="id-card">${x.name}</div>
      </div>`
    })
    this.client.getState().G.events.forEach(event => {
      let cards = ''
      event.cards.forEach(card => {
        cards += `
        <li>
        <div class="a"><i class="fas fa-euro-sign"></i> ${card.A}</div>
        <div class="b"><i class="fas fa-box"></i> ${card.B}</div>
        <div class="c"><i class="fas fa-carrot"></i> ${card.C}</div>
        </li>
        `
      })
      events += `
      <li class="event" id="event-${event.event.name}">
      <div class="id-event">${event.event.name}</div>
      <div class="a"><i class="fas fa-euro-sign"></i> ${event.event.A}</div>
      <div class="b"><i class="fas fa-box"></i> ${event.event.B}</div>
      <div class="c"><i class="fas fa-carrot"></i> ${event.event.C}</div>
      <ul class="cards">
      ${cards}
      </ul>
      </li>
      `
    })
    this.rootElement.innerHTML = `
        <ul id="events">
       ${events}
        </ul>
        <div class="hand">
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
    this.rootElement.querySelectorAll('.event').forEach(x => {
      x.onclick = handleEventClick
    })
  }
}

const appElement = document.getElementById('app')
new ProLocoClient(appElement)
