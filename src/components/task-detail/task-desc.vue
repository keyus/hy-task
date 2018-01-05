<template>
  <div class="task-item task-item-desc">
    <div class="task-item-lb"><label>描述</label></div>
    <div class="task-item-rb">
      <template v-if="editable">
        <textarea v-model="value2" placeholder="请添加任务描述" maxlength="300"></textarea>
        <label>{{value2 ? value2.length : 0}} / 300</label>
      </template>
      <template v-else>
        {{value2 || '无'}}
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name : 'taskDesc',
    props : {
      value : {},
      editable : {
        type : Boolean,
        default : true,
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
