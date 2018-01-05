import Vue from 'vue'
import _ from '../utils/utils'

Vue.directive('scroll', {
  bind: function (el, binding) {
    let callback = binding.value;
    el.addEventListener('scroll',_.throttle(function () {
      let height = el.clientHeight;
      let top = el.scrollTop;
      let sh  = el.scrollHeight;
      if(height + top >= sh){
        callback();
      }
    },300));
  }
});
