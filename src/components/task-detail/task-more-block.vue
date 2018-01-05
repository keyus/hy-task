<template>
  <div class="detail-area-more">

    <div class="detail-area-more__body" v-show="visible">
      <!--附件-->
      <task-attachments v-model="files" :task-id="taskId"  :editable="editable.attachment"></task-attachments>
      <!--公开-->
      <task-open v-model="detail.task.opened" :editable="editable.opened"></task-open>
      <!--开始时间-->
      <task-start v-model="detail.task.beginDate" :editable="editable.time"></task-start>
      <!--工作组-->
      <task-group v-model="detail.task.groups"  :editable="editable.groups"></task-group>

      <!--关注人-->
      <div class="task-item task-item-member" v-if="module.concerns">
        <div class="task-item-lb"><label>关注人</label></div>
        <div class="task-item-rb">
          <task-select-user :user="user"
                            :editable="editable.concerns"
                            :excludeUser="excludeIds"
                            excludeTip ="选择结果不能含有负责人或参与人"
                            v-model="detail.concerns"></task-select-user>
        </div>
      </div>

      <!--提醒-->
      <task-notice  v-if="module.notice"
                    v-model="detail.task.notice"
                    :editable="editable.notice"></task-notice>

      <!--周期创建-->
      <task-period v-if="module.period"
                   v-model="period"
                   :task-period="detail.taskPeriod"
                   :editable="editable.period"></task-period>

      <!--功能按钮-->
      <task-menus></task-menus>
    </div>

    <div class="detail-area-more__text" @click="visible = !visible">
      <template v-if="!visible">更多 <span class="iconfont icon-you"></span></template>
      <template v-else>收起 <span class="iconfont icon-shang"></span></template>
    </div>
  </div>
</template>

<script>
  import { mapState,mapGetters } from 'vuex'
  export default {
    name : 'taskMoreBlock',
    props : {
      detail : {},
      taskId : {},
      editable : {},
    },
    computed : {
      ...mapState({
        user : 'user'
      }),
      //菜单控制的模块可见交互
      ...mapGetters({
        module : 'taskModuleVisible'
      }),
      //关注人排除的ID数组
      excludeIds(){
        let res = [];
        this.detail.members.forEach(it=> res.push(it.cn));
        this.detail.manager.cn && res.push(this.detail.manager.cn);
        this.detail.creator.cn && res.push(this.detail.creator.cn);
        return res;
      }
    },
    data(){
      return {
        visible : false,
        files   : [],   //附件数据模型
        period  : {},   //周期数据模型
      }
    },
    watch : {
      files(val){
        this.$store.commit('updateFilesModel',val);
      },
      period(val){
        this.$store.commit('updatePeriodModel',val);
      },
    },
    methods : {

    }
  }
</script>
