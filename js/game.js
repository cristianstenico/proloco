import cards from './cards/*.json'
import events from './events/*.json'
import { INVALID_MOVE } from 'boardgame.io/core'

function getCards () {
  const c = []
  Object.keys(cards).forEach(x => {
    c.push(cards[x])
  })
  return c
}

function getEvents () {
  const c = []
  Object.keys(events).forEach(x => {
    c.push(events[x])
  })
  return c
}

export default {
  name: 'LocoProloco',
  setup: ctx => {
    const c = ctx.random.Shuffle(getCards())
    const e = ctx.random.Shuffle(getEvents())
    const hands = Array(ctx.numPlayers)
    for (let x = 0; x < ctx.numPlayers; x++) {
      hands[x] = c.splice(0, 3)
    }
    return {
      cardsDeck: c,
      events: [{
        event: e[0],
        cards: []
      }],
      eventsDeck: e.splice(1),
      hands,
      eventsFilled: 0
    }
  },
  moves: {
    playCard: (G, ctx, idCard, idEvent, up) => {
      const card = G.hands[ctx.currentPlayer].find(x => x.name === idCard)
      const event = G.events.find(x => x.event.name === idEvent)
      if (event.people === 1) {
        if (event.event.A - (card[up ? 'up' : 'down'].values.A || 0) > 0) { return INVALID_MOVE }
        if (event.event.B - (card[up ? 'up' : 'down'].values.B || 0) > 0) { return INVALID_MOVE }
        if (event.event.C - (card[up ? 'up' : 'down'].values.C || 0) > 0) { return INVALID_MOVE }
      }
      // validate pre-requisites
      if (up) {
        if (card.up.pre.events) {
          const [op, n] = card.up.pre.events.split(' ')
          switch (op) {
            case '=':
              if (G.eventsFilled !== parseInt(n)) return INVALID_MOVE
              break
            case '<':
              if (G.eventsFilled >= parseInt(n)) return INVALID_MOVE
              break
            case '>':
              if (G.eventsFilled <= parseInt(n)) return INVALID_MOVE
              break
          }
        }
        let err = false;
        ['A', 'B', 'C'].forEach(x => {
          if (card.up.pre[x]) {
            const [op, n] = card.up.pre[x].split(' ')
            switch (op) {
              case '=':
                if (event[x] !== parseInt(n)) err = true
                break
              case '<':
                if (event[x] >= parseInt(n)) err = true
                break
              case '>':
                if (event[x] <= parseInt(n)) err = true
                break
            }
          }
        })
        if (err) return INVALID_MOVE
      }
      event.event.A -= card[up ? 'up' : 'down'].values.A || 0
      event.event.B -= card[up ? 'up' : 'down'].values.B || 0
      event.event.C -= card[up ? 'up' : 'down'].values.C || 0
      event.cards.push(up ? card.up.values : card.down.values)
      event.event.people--
      // trigger post action
      if (!up) {
        for (let i = 0; i < card.down.post.events; i++) {
          const ev = G.eventsDeck.splice(0, 1)[0]
          G.events.push({
            event: ev,
            cards: []
          })
        }
      }
      // tolgo la carta giocata
      G.hands[ctx.currentPlayer].splice(G.hands[ctx.currentPlayer].findIndex(x => x.name === card.name), 1)
      // pesco una nuova carta
      if (G.cardsDeck.length) {
        G.hands[ctx.currentPlayer].push(G.cardsDeck.splice(0, 1)[0])
      }
      if (event.event.A <= 0 && event.event.B <= 0 && event.event.C <= 0) {
        G.eventsFilled++
        G.events.splice(G.events.findIndex(x => x.event.name === event.event.name), 1)
      }
      ctx.events.endTurn()
    }
  },
  endIf: (G, ctx) => {
    if (G.events.length === 0) {
      return { win: true }
    }
    if (G.hands.reduce((x, current) => { return x + current.length }, 0) === 0) {
      return { win: false }
    }
  }
}
