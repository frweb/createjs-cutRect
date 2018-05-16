import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import GameCreate from '@/components/GameCreate'
import Game from '@/components/Game'
import Success from '@/components/Success'
import End from '@/components/End'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/game',
            name: 'game',
            component: Game
        },
        {
            path: '/',
            name: 'game',
            component: GameCreate
        },
        {
            path: '/end',
            name: 'end',
            component: End
        },
        {
            path: '/success',
            name: 'success',
            component: Success
        }
    ]
})
