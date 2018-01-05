<template>
  <div class="task-bar">
    {{name}}
    <a href="javascript:;" class="iconfont icon-tianjiajiahaowubiankuang" @click="close"></a>
  </div>
</template>

<script>
  export default {
    name : 'taskBar',
    props : {
      name : {
        type    : String,
        default : '任务详情'
      }
    },
    methods : {
      close(){
        this.$emit('close');
      }
    }
  }
</script>
