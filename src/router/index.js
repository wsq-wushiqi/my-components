/*
 * @Author: Wushiqi
 * @Descripttion: 路由
 * @Date: 2021-03-02 11:35:28
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-03-02 13:39:36
 */
import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    }
  ]
})
