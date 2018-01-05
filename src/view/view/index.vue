<template>
  <div class="mytask">
    <!--return-->
    <div class="task-back">
      <div class="task-back__right">
        <router-link to="/mytask"><span class="iconfont icon-fanhui"></span>返回</router-link>
      </div>
    </div>
    <view-header :detail="detail"></view-header>
    <view-nav :task-id="taskId"></view-nav>
    <div class="view-body">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>

  import viewHeader from './header.vue'
  import viewNav from './nav.vue'
  import { mapState } from 'vuex'

  export default {
    components : {
      viewHeader,
      viewNav,
    },
    data (){
      return {
      }
    },
    computed : {
      ...mapState({
        detail : 'task'
      }),
      taskId() {
        return this.$route.query ? this.$route.query.taskId : '';
      }
    },

    created () {
      this.init();
    },

    methods : {
      async init () {
        try{
          let task    = await this.$api.getTask(this.taskId);
          if(task.code === 200) {
            this.$store.commit('updateTask',task.data);
          }
          if(task.code === 1007) {
            await this.$alert('该任务已删除');
            this.$router.push('mytask');
          }
        } catch (e){

        }
      },
    },


  }
</script>
