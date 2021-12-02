<template lang="pug">
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
                template(v-for="(p, index) in m.players")
                  a.button.hollow(
                    v-if="p.name === $store.state.playerName"
                    @click="goToMatch(m.matchID, index, $store.state.credentials)"
                  ) {{ p.name }}
                  a.button.hollow.disabled(
                    v-else-if="p.name"
                  ) {{ p.name }}
                  a.button(
                    v-if="!p.name"
                    @click="joinMatch(m.matchID)"
                  ) Aggiungiti
    .cell
      h2 Inizia una nuova Partita:
    .cell.medium-2
      label Numero giocatori
        input(id="numplayers" type="number" v-model="numPlayers")
      a.button(
        @click="createMatch"
        :class="{disabled: wait}"
      ) Inizia
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
      numPlayers: 2,
      wait: false
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
      this.wait = true
      await lobbyClient.createMatch('LocoProloco', {
        numPlayers: this.numPlayers
      })
      await this.listMatches()
      this.wait = false
    },
    async goToMatch (matchID, playerID, playerCredentials) {
      this.$router.push({ name: 'game', params: { matchID, playerID, playerCredentials } })
    },
    async joinMatch (matchID) {
      const { playerCredentials, playerID } = await lobbyClient.joinMatch('LocoProloco', matchID, { playerName: this.$store.state.playerName })
      this.$store.commit('setCredentials', playerCredentials)
      window.localStorage.setItem('proloco-credentials', JSON.stringify({ playerName: this.$store.state.playerName, credentials: playerCredentials }))
      this.$router.push({ name: 'game', params: { matchID, playerID, playerCredentials } })
    }
  }
}
</script>
