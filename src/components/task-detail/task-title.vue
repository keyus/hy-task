<!--任务标题-->

<template>
  <div class="task-title">

    <div class="task-title__lb">
      <task-avatar :avatar="creator"
                   :avatar-title="avatarTitle"></task-avatar>
    </div>
    <div class="task-title__rb">
      <template v-if="editable">
        <input type="text"
               v-model="value2"
               :maxlength="size"
               :placeholder="placeholder">
        <label>{{value2.length}} / {{size}}</label>
      </template>

      <template v-else>
        {{value2}}
      </template>
    </div>

  </div>
</template>

<script>
  export default {
    name : 'taskTitle',
    props: {
      placeholder : {
        type : String,
        default : '请输入任务名称'
      },
      value : {
        type : [String,Number],
        default : ''
      },
      //最大输入
      size : {
        type : [String,Number],
        default : 20,
      },
      //avatar人员信息
      creator : {
        type : Object,
        default(){ return {} ;}
      },
      createTime : {
        type : String,
        default : ''
      },
      //可编辑
      editable: {
        type : Boolean,
        default : true
      }
    },
    data (){
      return {
        value2 : this.value
      }
    },
    computed : {
      avatarTitle (){
        let text = '';
        if(this.creator.userName){
          text += '任务创建人：' + this.creator.userName;
        }
        if(this.createTime) {
          text += '　创建时间：' + this.createTime ;
        }
        return text;
      }
    },
    watch : {
      value(val){
        this.value2 = val;
      },
      value2(val){
        val !== this.value && this.$emit('input',val);
      },
      editable : {
        immediate : true,
        handler (val){
        }
      }
    }
  }
</script>
