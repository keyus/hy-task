<template>
  <div class="task-item task-item-open">
    <div class="task-item-lb"><label>工作组</label></div>
    <div class="task-item-rb">
      <hy-checkbox v-model="value2"
                   :disabled="!editable"
                   :true-label="1"
                   :false-label="0">创建</hy-checkbox>
    </div>
  </div>
</template>

<script>
  export default {
    name : 'taskGroup',
    props : {
      value : {},
      editable : {
        type : Boolean,
        default : true
      },
    },
    data(){
      return {
        value2 : this.value
      }
    },
    watch : {
      value (val){
        this.value2 = val;
      },
      value2 (val){
        if(val === this.value) return ;
        this.$emit('input',val)
      }
    }
  }
</script>
