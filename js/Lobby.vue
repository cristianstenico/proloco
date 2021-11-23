<template lang="pug">
.top-bar
  .top-bar-right
    p {{ $store.state.playerName }}
.grid-container
  .grid-x
    .cell
      h1 Partite in corso
      table
        thead
          tr
            th Partite in corso
            th giocatori
        tbody
          tr(v-if="!matches.length")
            td -
            td -
          tr(v-for="m in matches")
            td {{ m.matchID }}
            td
              .button-group
                template(v-for="p in m.players")
                  a.button.hollow.disabled(
                    v-if="p.name"
                  ) {{p.name}}
                  a.button(
                    v-if="!p.name"
                    @click="joinMatch(m.matchID, p.id)"
                  ) Aggiungiti
    .cell
      h2 Inizia una nuova Partita:
    .cell.medium-2
      label Numero giocatori
        input(id="numplayers" type="number" v-model="numPlayers")
      a.button(@click="createMatch") Inizia
</template>
<script>
import { LobbyClient } from 'boardgame.io/client'
const lobbyClient = new LobbyClient({
  server: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''
})
export default {
  data () {
    return {
      matches: [],
      numPlayers: 2
    }
  },
  async created () {
    await this.listMatches()
  },
  methods: {
    async listMatches () {
      this.matches = (await lobbyClient.listMatches('LocoProloco')).matches
    },
    async createMatch () {
      await lobbyClient.createMatch('LocoProloco', {
        numPlayers: this.numPlayers
      })
      await this.listMatches()
    },
    async joinMatch (match, playerID) {
      await lobbyClient.joinMatch('LocoProloco', match, { playerID: playerID.toString(), playerName: this.$store.state.playerName })
      this.$router.push(`/game/${match}`)
    }
  }
}
</script>
