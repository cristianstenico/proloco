import { createStore } from 'vuex'

export default createStore({
  state: {
    playerName: null
  },
  mutations: {
    authenticate (state, user) {
      state.playerName = user
    }
  }
})
