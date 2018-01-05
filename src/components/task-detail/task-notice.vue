<template>
  <div class="task-item">
    <div class="task-item-lb"><label>提醒</label></div>
    <div class="task-item-rb">
      <div class="task-item-notice">
        结束前
        <template v-if="editable">
          <select v-model="value2">
            <option value="1">1天</option>
            <option value="2">2天</option>
            <option value="3">3天</option>
            <option value="4">4天</option>
            <option value="5">5天</option>
            <option value="0">不提醒</option>
          </select>
          <template v-show="value2 != 0">提醒</template>
        </template>
        <template v-else>
          {{value2 | notice}}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name : 'taskNotice',
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
    },
    filters : {
      notice (val){
        if(val == 0) return '不提醒';
        if(val == 1) return '1天提醒';
        if(val == 2) return '2天提醒';
        if(val == 3) return '3天提醒';
        if(val == 4) return '4天提醒';
        if(val == 5) return '5天提醒';
      }
    }
  }
</script>
