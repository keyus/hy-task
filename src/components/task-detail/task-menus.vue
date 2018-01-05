<template>
  <div class="detail-area-more__btn">
    <a href="javascript:;" @click="toggle('concerns')" v-if="concernsBtn">
      <span class="iconfont icon-touxiang"></span>添加关注人
    </a>
    <a href="javascript:;" @click="toggle('notice')" v-if="noticeBtn">
      <span class="iconfont icon-note"></span>提醒
    </a>
    <a href="javascript:;" @click="toggle('period')" v-if="periodBtn">
      <span class="iconfont icon-date-2"></span>周期创建
    </a>
    <a href="javascript:;" @click="toggle('taskChild')" v-if="taskChildBtn">
      <span class="iconfont icon-text"></span>子任务
    </a>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  export default {
    name : 'taskMenus',
    computed : {
      //导入任务详情
      ...mapState({
        detail : 'task'
      }),
      //导入权限
      ...mapGetters({
        editable : 'getTaskEditable'
      }),
      //计算哪些菜单是显示的 -//条件：拥有关注人管理权限,  且该任务详情关注人未添加 ,  且自身的状态为真 | 以下菜单同理
      concernsBtn (){
        return this.editable.concerns && this.menus.concerns;
      },
      noticeBtn (){
        return this.editable.notice && this.menus.notice;
      },
      periodBtn (){
        return this.editable.period && this.menus.period;
      },
      taskChildBtn (){
        return this.editable.taskChild && this.menus.taskChild;
      }
    },
    data () {
      return {
        //菜单状态
        menus : {
          concerns  : false,
          notice    : false,
          period    : false,
          taskChild : false,
        }
      }
    },
    mounted (){
      /***
       * 不在watch上操作，是因为菜单的状态，操作完成后不可逆
       * @type {boolean}
       */
      this.menus.concerns   = !this.detail.concerns.length;
      this.menus.notice     = !this.detail.task.notice;
      this.menus.period     = !this.detail.task.period;
      this.menus.taskChild  = !this.detail.childTaskCount;
      this.$store.commit('updateTaskMenus', Object.assign({},this.menus));
    },
    methods : {
      toggle(name){
        this.menus[name] = false;
        this.$store.commit('updateTaskMenus', Object.assign({},this.menus));
      }
    },

  }
</script>
