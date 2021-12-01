<template lang="pug">
.grid-container
  .grid-x
    .cell
      h1 Nome Giocatore
    .cell.medium-4
      label Il tuo Nome
        input(
          type="text"
          v-model="playerName"
        )
      a.button(
        :class="{disabled:!playerName}"
        @click="enter"
      ) Entra
</template>
<script>
export default {
  data () {
    return {
      playerName: ''
    }
  },
  methods: {
    enter () {
      this.$store.commit('authenticate', this.playerName)
      window.localStorage.setItem('proloco-credentials', JSON.stringify({ playerName: this.playerName }))
      this.$router.push('lobby')
    }
  }
}
</script>
