<template lang="pug">
.top-bar
  .top-bar-right
    ul.menu
      li
        i.fa-solid.fa-user-large
        |  {{ $store.state.playerName }}
.grid-container
  .grid-x
    .cell
      h1 Partite in corso
      table
        thead
          tr
            th Partita
            th Giocatori
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
                    @click="joinMatch(m.matchID)"
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
  server: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://proloco-game.herokuapp.com'
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
    async joinMatch (matchID) {
      const { playerCredentials, playerID } = await lobbyClient.joinMatch('LocoProloco', matchID, { playerName: this.$store.state.playerName })
      this.$store.commit('setCredentials', playerCredentials)
      this.$router.push({ name: 'game', params: { matchID, playerID, playerCredentials } })
    }
  }
}
</script>
