import Vue from 'vue'
import Store from '../../../store/index'
import taskView from './index.vue'

const taskViewConstructor = Vue.extend(taskView);

let instance , vm;
let msgQueue = [];

/***
 * 任务详情 dialog
 * options object {}
 * options.taskId 必填
 */

const openTaskView = (options)=>{
  instance = new taskViewConstructor({
    store: Store,
    data :  {
      taskId : options.taskId
    }
  });



  vm       = instance.$mount();
  document.body.appendChild(vm.$el);
  vm.visible   = true;
  return new Promise( (resolve,reject)=>{

    msgQueue.push({
      options : options,
      resolve : resolve,
      reject : reject,
    });

    showNext();

    vm.$on('enter',(data)=>{
      vm.visible   = false;
      resolve(data);
    })
    vm.$on('close',(type)=>{
      vm.visible   = false;
      reject(type);
    })
  })
}


const showNext = ()=>{

}
export default openTaskView
