import Vue from 'vue'
import Store from '../../../store/index'
import taskView from './index.vue'
const taskViewConstructor = Vue.extend(taskView);

let msgQueue = [];
let instanceQue = [];

const showNextOpen = ()=>{
  let { options, resolve, reject, instance } = msgQueue.shift();
  instance = new taskViewConstructor({
    store: Store,
    data :  {
      taskId : options.taskId
    }
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.visible   = true;
  instanceQue.push(instance);

  instance.$on('afterRender',()=>{
    let index = instanceQue.indexOf(instance);
    if(index !== -1 && index !== 0) {
      let prevInstace        = instanceQue.shift();
      prevInstace.animation    = false;
      setTimeout(()=> prevInstace.visible  = false, 0 )
    }
  })

  instance.$on('enter',(data)=>{
    instance.visible   = false;
    resolve(data);
  })

  instance.$on('close',(type)=>{
    instance.visible   = false;
    reject(type);
  })

}
/***
 * 任务详情 dialog
 * options object {}
 * options.taskId 必填
 */
const openTaskView = (options)=>{
  return new Promise( (resolve,reject)=>{
    msgQueue.push({
      options     : options,
      resolve     : resolve,
      reject      : reject,
      instance    : null,
    });
    showNextOpen();
  })
}

export default openTaskView
