<template lang="pug">
.top-bar
  .top-bar-right
    ul.menu
      li(v-if="$store.state.playerName")
        a.button(@click="logout") Logout
        i.fa-solid.fa-user-large
        |  {{ $store.state.playerName }}
router-view
</template>
<script>
export default {
  data () {
    return {
    }
  },
  created () {
    const storage = window.localStorage
    let savedCredentials = storage.getItem('proloco-credentials')
    console.log(savedCredentials)
    if (savedCredentials) {
      savedCredentials = JSON.parse(savedCredentials)
      this.$store.commit('setCredentials', savedCredentials.credentials)
      this.$store.commit('authenticate', savedCredentials.playerName)
      this.$router.push({ name: 'lobby' })
    }
  },
  methods: {
    logout () {
      window.localStorage.removeItem('proloco-credentials')
      this.$store.commit('clear')
      this.$router.push('/')
    }
  }
}
</script>
