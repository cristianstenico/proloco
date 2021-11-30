import { createStore } from 'vuex'

export default createStore({
  state: {
    playerName: null,
    credentials: null,
    showID: false
  },
  mutations: {
    authenticate (state, user) {
      state.playerName = user
    },
    setCredentials (state, credentials) {
      state.credentials = credentials
    }
  }
})
