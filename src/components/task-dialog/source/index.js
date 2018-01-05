import Vue from 'vue'
import Store from '../../../store/index'
import sourceView from './index.vue'

const sourceViewConstructor = Vue.extend(sourceView);

let instance ,vm;

/***
 * @param options
 * options参数为对象 {
 *    taskId : ''       任务源ID - type=new 时，不用传
 *    type   : ''       调用类型  undefined默认  dispatch指派   get获取    new新建任务源
 * }
 * submit 触发resolve
 * @returns {Promise}
 */

const openSource = (options)=>{
  if(instance){
    document.body.removeChild(vm.$el);
  }
  instance = new sourceViewConstructor({
    store: Store,
    data : options || {}
  })
  vm       = instance.$mount();
  document.body.appendChild(vm.$el);
  vm.visible   = true;
  return new Promise( (resolve,reject)=>{
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
export default openSource
