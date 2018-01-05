import Vue from 'vue'
import MainView from './src/main.vue'
const MainViewConstructor = Vue.extend(MainView);

let instance;
let vm;

/**
 * 任务中心新建页面-编辑弹窗
 * @param options 对象 {}
 * @returns {Promise}
 */
var centerEdit = (options)=>{

  instance = new MainViewConstructor({
    data : options || {}
  });
  vm       = instance.$mount();
  document.body.appendChild(vm.$el);
  vm.visible   = true;
  return new Promise( (resolve,reject)=>{
    vm.$on('enter',(data)=>{
      vm.visible   = false;
      resolve(data);
    })
    vm.$on('close',()=>{
      vm.visible   = false;
      reject();
    })
  })

};

export default centerEdit;
