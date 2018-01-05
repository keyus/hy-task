<template>
  <transition name="slide-in"
              :css="animation"
              @after-enter="afterEnter">
    <section class="task-fix" v-if="visible">

      <task-bar :name="dialogName" @close="close"></task-bar>

      <div class="task-scroll"
           v-loading="loading"
           v-scroll="loadingNextPage">
        <template v-if="initFinish">
          <!--任务标题-->
          <task-title :editable="editable.name"
                      :creator="detail.creator"
                      :create-time="detail.task.createTime"
                      v-model="detail.task.name"></task-title>
          <!--主区块-->
          <task-main-block :detail="detail"
                           :task-id="taskId"
                           :editable="editable"></task-main-block>

          <!--更多区块-->
          <task-more-block :detail="detail"
                           :task-id="taskId"
                           :editable="editable"></task-more-block>

          <!--子任务-->
          <task-child :visable="module.taskChild"
                      :task-id.sync="taskId"
                      :editable="editable.taskChild"></task-child>

          <!--评论区块-->
          <task-comment :user="user"
                        :task-id="taskId"
                        :allow-comment="allowComment"></task-comment>
        </template>
      </div>

      <task-toolbar v-if="initFinish"
                    v-loading="fileLoading"
                    @submit="submit"
                    @close="close"></task-toolbar>

    </section>
  </transition>
</template>

<script>
  import { mapState , mapGetters } from 'vuex'
  import { taskModel } from '../../task-detail/task'
  export default {
    data(){
      return {
        animation   : true,       //是否有动画效果
        taskId      : '',
        isChild     : false,      //是否是子任务
        dialogName  : '任务详情',
        visible     : false,
        loading     : false,
        initFinish  : false,      //初始化任务详情是否调用完成
        allowComment: true,
      }
    },
    computed : {
      ...mapState({
        detail : 'task',
        user : 'user',
        fileLoading : 'fileLoading'
      }),
      ...mapGetters({
        updateModel : 'getUpdateTaskModel',
        editable    : 'getTaskEditable',        //权限
        module      : 'taskModuleVisible'       //子任务模块可见性
      })
    },
    watch : {
      visible(val){
        if(!val){
          this.$nextTick(()=>{
            this.$destroy();
          });
        }
      },
    },
    created () {
      this.init();
    },
    methods : {
      async init(){
        this.loading     = true;
        try{
          let task    = await this.$api.getTask(this.taskId);
          if(task.code === 200) {
            this.$store.commit('updateTask',task.data);
            this.initFinish = true;
          }
          if(task.code === 1007) {
            await this.$alert('该任务已删除');
            this.$emit('close','delete'); //删除列表项
          }
        } catch (e){
        }
        this.loading  = false;
      },
      close(type){
        this.$emit('close',type)
      },

      async submit() {
        if(!this.checkVaild()) return ;
        this.loading = true;
        try{
          let res   = await this.$api.updateTask(this.updateModel);
          if(res.code !== 200){
            this.$alert(res.msg);
            this.loading = false;
            return ;
          }
          this.$emit('enter',this.detail)
        } catch (e){
        }
        this.loading = false;
      },

      checkVaild (){
        let vaild = true;
        if (this.updateModel.name === "") {
          this.$alert('请输入任务名称'); vaild = false;  return vaild;
        }
        if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(this.updateModel.name)) {
          this.$alert('任务名称只能输入英文、中文和数字'); vaild = false;   return vaild;
        }
        //任务描述长度
        if (this.updateModel.description && this.updateModel.description.length > 300) {
          this.$alert('任务描述长度超出限制'); vaild = false;   return vaild;
        }
        if (new Date(this.updateModel.endDate).getTime() < new Date(this.updateModel.beginDate).getTime()) {
          this.$alert('结束日期不能早于开始日期'); vaild = false;   return vaild;
        }
        return vaild;
      },

      //加载下一页评论
      loadingNextPage(){
        this.$store.commit('updateLoadingNextPageComment',true);
      },

      afterEnter(){
        this.$emit('afterRender');
      },
    }
  }
</script>
