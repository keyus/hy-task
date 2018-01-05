import Vue from 'vue';
import periodView from './src/index.vue'
let periodConstructor = Vue.extend(periodView);
let instance;

let period = function(options) {
    if (Vue.prototype.$isServer) return;
    return new Promise( (resolve,reject) => {
        instance = new periodConstructor({
            data : options || {},
        });
        instance.vm = instance.$mount();
        document.body.appendChild(instance.vm.$el);
        instance.vm.visible = true;

        instance.vm.$on('enter',data => resolve (data));
        instance.vm.$on('close',()=>reject ());
    });

};

export default period;
