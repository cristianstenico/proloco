import { createRouter, createWebHashHistory } from 'vue-router'
import Login from './Login.vue'
import Lobby from './Lobby.vue'
import Game from './Game.vue'
import store from './store'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: 'login', path: '/', component: Login },
    { name: 'lobby', path: '/lobby', component: Lobby },
    { name: 'game', path: '/game', component: Game, props: true }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.state.playerName) next({ name: 'login' })
  else next()
})

export default router
