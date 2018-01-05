import Vue from 'vue'
import Store from './store/index'
import App from './App'
import router from './router'
import hypc from 'hyhc-pc'
import taskDetail from './components/task-detail/index'
import * as Api from './api/api'
import "hyhc-pc/lib/hyhc-pc-common.css"
import './scss/main.scss'
import './filters/index'
import './directive/index'

Vue.use(hypc);
import taskAvatar from './components/task-avatar.vue'
import taskHeader from './components/task-header.vue'
import taskFilter from './components/task-filter.vue'
import taskCard from './components/task-card.vue'
import taskCardSimple from './components/task-card-simple.vue'
import taskCreateForm from './components/task-create-form.vue'
import taskSelectUser from './components/task-select-user.vue'

import taskCenterEdit from './components/task-center-edit/index'
import taskFilterDialog from './components/task-filter-dialog/index'
import taskPeriod from './components/task-period/index'
import {taskDialog,taskSourceDialog} from './components/task-dialog/index'


Vue.component(taskAvatar.name, taskAvatar);
Vue.component(taskHeader.name, taskHeader);
Vue.component(taskFilter.name, taskFilter);
Vue.component(taskCard.name, taskCard);
Vue.component(taskCardSimple.name, taskCardSimple);
Vue.component(taskCreateForm.name, taskCreateForm);
Vue.component(taskSelectUser.name, taskSelectUser);
// Vue.config.productionTip = false;

Vue.prototype.$api               = Api;
Vue.prototype.$taskCenterEdit    = taskCenterEdit;      //任务中心编辑s
Vue.prototype.$taskFilterDialog  = taskFilterDialog;    //过滤器
Vue.prototype.$taskSourceDialog  = taskSourceDialog;    //任务源详情
Vue.prototype.$taskDialog        = taskDialog;          //任务详情
Vue.prototype.$taskPeriod        = taskPeriod;          //任务周期

Vue.use(taskDetail);
const init = async ()=>{
  try{
    let fs,user;

    if(!sessionStorage.getItem('fs') || !sessionStorage.getItem('user')){
      fs    = await Api.FS();
      fs    = fs.HTTP;
      user  = await Api.getUser();
      user  = user.data[0];
      user && sessionStorage.setItem('user',JSON.stringify(user));
      sessionStorage.setItem('fs',fs);
    }else{
      fs    = sessionStorage.getItem('fs');
      user  = JSON.parse(sessionStorage.getItem('user'));
    }
    Store.commit('updateFs',fs);
    Store.commit('updateUser',user);
    //替换api,中user:jid内存地址，使后续的api静态导出能在jid参数丢失的情况下顺利使用
    Vue.prototype.$api.default.cn = Store.state.user.cn;
    Vue.prototype.$api.default.fileUrl = Store.state.fs;

    new Vue({
      el: '#app',
      router,
      store : Store,
      template: '<App/>',
      components: { App }
    })
  } catch(e) {

  }
};
init();

