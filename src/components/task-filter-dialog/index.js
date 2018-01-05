import Vue from 'vue'
import filterDialog from './src/main.vue'
const  FilterDialogConstructor = Vue.extend(filterDialog);

let instance;
let vm;

/**
 * 过滤器弹窗
 * @param ele         吸附的节点
 * @param filter      过滤器参数-只能是我的任务-与任务中心的，具体格式对应  store的状态
 * @param isCenter    是否为任务中心
 * @returns {Promise} 返回值 Promise  确定：resolve(data) data：为弹窗过滤器内部状态  其它:reject
 */
var filterDialogFun = (ele,filter,isCenter)=>{


  if(typeof filter !== 'object') throw new Error('options query is a object');
  let rect    = ele.getBoundingClientRect();
  let height  = ele.clientHeight;
  let top     = rect.top + height + 8;
  let style   = `left:${rect.left}px;top:${top}px`;
  filter      = Object.assign({},filter);

  instance = new FilterDialogConstructor({
    data : {
      style,
      isCenter,
      filter,
    }
  });
  vm       = instance.$mount();
  document.body.appendChild(vm.$el);
  vm.visible   = true;

  return new Promise( (resolve,reject)=>{
    vm.$on('enter',(data)=>{
      vm.visible   = false;
      resolve(data);
    });
    vm.$on('close',()=>{
      vm.visible   = false;
      vm.$nextTick(()=>{
        vm.$destroy();
      });
      reject();
    })
  })


};

export default filterDialogFun;
