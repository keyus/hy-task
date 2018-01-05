<template>
  <div class="detail-area-more">

    <div class="detail-area-more__body" v-show="visible">
      <!--附件-->
      <task-attachments v-model="files" :task-id="taskId" :editable="editable.attachment" :is-new="isNew" ></task-attachments>
      <!--任务中心名称-->
      <task-center-name :name="detail.centerName"></task-center-name>
      <!--公开-->
      <task-open v-model="detail.task.opened" :editable="editable.opened"></task-open>
      <!--开始时间-->
      <task-start v-model="detail.task.beginDate" :editable="editable.time"></task-start>
    </div>

    <div class="detail-area-more__text" @click="visible = !visible">
      <template v-if="!visible">更多 <span class="iconfont icon-you"></span></template>
      <template v-else>收起 <span class="iconfont icon-shang"></span></template>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name : 'taskSourceMoreBlock',
    props : {
      detail : {},
      taskId : {},
      editable : {},
      type  : {},
    },
    computed : {
      ...mapState({
        user : 'user'
      }),
      isNew() {
        return this.type === 'new'
      }
    },
    data(){
      return {
        visible : false,
        files   : [],   //附件数据模型
      }
    },
  }
</script>
