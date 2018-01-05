import Vue from 'vue';

Vue.directive('avatar', {
  bind: function (el, binding) {
    // let avatar = binding.value == 0 ? icon.man : icon.woman;
    let head = el.getAttribute('head');
    if(head){
      el.style.backgroundImage= head;
    }else{
      el.classList.remove('man','woman');
      if(binding.value == 0){
        el.classList.add('man');
      }else{
        el.classList.add('woman');
      }
    }
  },
  update: function (el,binding) {
    let head = el.getAttribute('head');
    if(head){
      el.style.backgroundImage= head;
    }else{
      el.classList.remove('man','woman');
      if(binding.value == 0){
        el.classList.add('man');
      }else{
        el.classList.add('woman');
      }
    }
  }
})
