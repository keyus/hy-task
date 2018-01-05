import Vue from 'vue'
import Router from 'vue-router'
import MyTaskIndex from '../view/mytask/index.vue'    //我的任务
import CenterIndex from '../view/center/index.vue'    //任务中心
import CountIndex from '../view/count/index.vue'      //统计分析
import CreateTask from '../view/create-task/index.vue'      //新建任务
import CreateCenter from '../view/create-task-center/index.vue'      //任务中心-设置
import SearchIndex from '../view/search/index.vue'      //搜索
import ViewIndex from '../view/view/index.vue'          //查看动态
import ViewDynamic from '../view/view/dynamic.vue'          //查看动态

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect : '/mytask'
    },
    //我的任务
    {
      path: '/mytask',
      name: 'mytask',
      component: MyTaskIndex
    },
    //任务中心
    {
      path: '/center',
      name: 'center',
      component: CenterIndex
    },
    //统计分析
    {
      path: '/count',
      name: 'count',
      component: CountIndex,
    },

    //任务详情-查看动态
    {
      path: '/view',
      name: 'view',
      component: ViewIndex,
      children : [
        {
          path: '/',
          redirect: '/view/dynamic'
        },
        {
          path: 'dynamic',
          component: ViewDynamic
        }
      ]
    },

    //新建任务
    {
      path: '/create',
      name: 'create',
      component: CreateTask,
    },
    //搜索
    {
      path: '/search',
      name: 'search',
      component: SearchIndex
    },
    //任务中心-设置
    {
      path: '/create-center',
      name: 'createCenter',
      component: CreateCenter
    }
  ]
})
