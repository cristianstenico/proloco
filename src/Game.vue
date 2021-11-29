<template lang="pug">
div(v-if="!state") ciao
div(v-else-if="true")
  h1(v-if="gameover") {{ gameover }}
  div(:id="`current-${this.client.playerID}`")
    b Eventi completati: {{ state.G.eventsFilled }}
  .event-wrapper
    .event(
      v-for="event in state.G.events"
      :id="`event-${event.event.name}`"
      @click="play(event.event.name)"
    )
      .a
        i.fa-solid.fa-euro-sign
        |  {{ event.event.A }}
      .b
        i.fa-solid.fa-box
        |  {{ event.event.B }}
      .c
        i.fa-solid.fa-carrot
        |  {{ event.event.C }}
      .people
        i.fa-solid.fa-child
        |  {{event.event.people}}
      .id-event {{ event.event.name }}
      .cards
        div(v-for="card in event.cards")
          .a(v-if="card.A")
            i.fa-solid.fa-euro-sign
            |  {{ card.A }}
          .b(v-if="card.B")
            i.fa-solid.fa-box
            |  {{ card.B }}
          .c(v-if="card.C")
            i.fa-solid.fa-carrot
            |  {{ card.C }}
  .hand(:class="{'current-player': isCurrent}")
    h3(v-if="isCurrent") È il tuo turno
    card(
      v-for="card in state.G.hands[parseInt(playerID)]"
      :card="card"
      :selected="card.name === selectedCard"
      @play="play"
    )
  .result(v-if="gameover") {{ gameover }}
</template>
<script>
import { Client } from 'boardgame.io/client'
import { SocketIO } from 'boardgame.io/multiplayer'
import Card from './components/Card.vue'
import game from './game'
export default {
  components: {
    Card
  },
  props: {
    matchID: {
      type: String,
      required: true
    },
    playerID: {
      type: String,
      required: true
    },
    playerCredentials: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      client: null,
      gameover: '',
      state: null,
      unsubscribe: null,
      selectedCard: -1,
      selectedCardTop: false
    }
  },
  computed: {
    isCurrent () {
      if (!this.state) return false
      return this.playerID === this.state.ctx.currentPlayer
    }
  },
  created () {
    this.client = Client({
      game,
      multiplayer: SocketIO({ server: process.env.NODE_ENV === 'development' ? 'localhost:8000' : 'https://proloco-game.herokuapp.com' }),
      matchID: this.matchID,
      playerID: this.playerID,
      credentials: this.playerCredentials,
      board: 'ciccio'
    })
    this.client.start()
    this.unsubscribe = this.client.subscribe(this.update)
  },
  unmounted () {
    this.unsubscribe()
    this.client.stop()
    this.client = this.unsubscribe = this.state = null
  },
  methods: {
    update (state) {
      console.log(state)
      this.state = state
      if (state === null) return
      if (state.ctx.gameover) {
        if (state.ctx.gameover.win) {
          this.gameover = 'YOU WIN!'
        } else {
          this.gameover = 'YOU LOSE!'
        }
      }
    },
    select ({ id, top }) {
      this.selectedCard = id
      this.selectedCardTop = top
    },
    play (event) {
      if (this.selectedCard === -1) return
      this.client.moves.playCard(this.selected, event, this.selectedCardTop)
      this.selectedCard = -1
    }
  }
}
</script>
