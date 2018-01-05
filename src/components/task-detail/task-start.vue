<template>
  <div class="task-item">
    <div class="task-item-lb"><label>开始时间</label></div>
    <div class="task-item-rb task-item-time"  :class="{'not-select-time' : !editable}">
      <hy-date-picker
        size="140"
        value-format="yyyy-MM-dd"
        v-model="value2"
        :clearable="false"
        type="date"
        :disabled="!editable"
        :editable="false"
        popper-class="hy-data-picker-blue">
      </hy-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    name : 'taskStart',
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
        if(val === this.value2) return ;
        this.value2 = val;
      },
      value2 (val){
        this.$emit('input',val)
      }
    }
  }
</script>
