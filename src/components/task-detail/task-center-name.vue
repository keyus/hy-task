<template>
  <div class="task-item">
    <div class="task-item-lb"><label>任务中心</label></div>
    <div class="task-item-rb">{{name}}</div>
  </div>
</template>

<script>
  export default {
    name : 'taskCenterName',
    props : {
      name : {},
    },
  }
</script>
