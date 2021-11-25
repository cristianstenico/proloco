<template lang="pug">
div(v-if="!state") ciao
div(v-else-if="true")
  h1(v-if="gameover") {{ gameover }}
  div(:id="`current-${this.client.playerID}`")
    b Eventi completati: {{ this.client.getState().G.eventsFilled }}
  .event-wrapper
    .event(
      v-for="event in state.G.events"
      :id="`event-${event.event.name}`"
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
      unsubscribe: null
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
      multiplayer: SocketIO({ server: process.env.NODE_ENV === 'development' ? 'localhost:8000' : '' }),
      matchID: this.matchID,
      playerID: this.playerID,
      credentials: this.playerCredentials,
      board: 'ciccio'
    })
    this.client.start()
    this.unsubscribe = this.client.subscribe(state => {
      this.state = state
    })
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
    }
  }
}
</script>
