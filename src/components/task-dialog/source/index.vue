<template>
  <transition name="slide-in">
    <section class="task-fix" v-if="visible">
      <task-bar :name="dialogName" @close="close"></task-bar>
      <div class="task-scroll" v-loading="loading">
        <template v-if="initFinish">
          <!--title-->
          <task-title placeholder="请输入任务源名称" :editable="editable.name" v-model="detail.task.name"></task-title>
          <!--main-->
          <task-source-main-block :editable="editable" :detail="detail" :task-id="taskId"></task-source-main-block>
          <!--more-->
          <task-source-more-block :editable="editable" :detail="detail" :task-id="taskId" :type="type"></task-source-more-block>
        </template>
      </div>
      <!--bottom-->
      <task-source-toolbar @close="close"
                           @submit="submit"
                           :type="type"
                           :is-creator="isCreator"></task-source-toolbar>
    </section>
  </transition>
</template>

<script>
  import { mapState , mapGetters } from 'vuex'
  import taskModel from '../../../store/taskModel'
  export default {
    computed : {
      ...mapState({
        user : 'user',
        detail : 'source',
      }),
      ...mapGetters({
        editable    : 'getSourceEditable',
        updateModel : 'getUpdateSourceModel'
      }),
      //创建人
      isCreator(){
        return this.user.cn === this.detail.creator.cn;
      }
    },
    data(){
      return {
        dialogName  : '任务源详情',
        taskId      : '',
        centerName  : '',
        type        : '',        //undefined(默认)  || dispatch (指派)  || get (领取)  ||  new(新建)
        visible     : false,
        loading     : false,
        initFinish  : false,      //初始化任务详情是否调用完成
      }
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
      if(this.type === 'new') {
        this.newHandler();
        return ;
      }
      this.init();
    },
    methods : {
      //新建
      newHandler(){
        let task                  = Object.assign({},taskModel);
            task.type             = 'new';
            task.centerName       = this.centerName;
        this.$store.commit('updateSource',task);
        this.initFinish = true;
      },
      async init(){
        this.loading     = true;
        try{
          let task    = await this.$api.getTask(this.taskId);
          if(task.code === 200) {
            task.data.type = this.type;

            this.type === 'get' && (task.data.manager = Object.assign({},this.user));
            this.$store.commit('updateSource',task.data);
            this.initFinish = true;
          }
        } catch (e){
        }
        this.loading  = false;
      },
      async close(){
        switch (this.type){
          case 'dispatch' :
            try{
              await this.$confirm('任务源还未指派，你确定要取消吗？');
              this.$emit('close');
            } catch (e) {}

            break ;
          case 'get' :
            try{
              await this.$confirm('任务源还未领取，你确定要取消吗？');
              this.$emit('close');
            } catch (e) {}

            break ;
          default :
            this.$emit('close');
        }

      },
      async submit(){
        if(!this.checkVaild()) return ;
        try{
          this.loading = true;
          let res ;

          //默认
          if(!this.type){
            res = await this.$api.updateTask(this.updateModel);
            this.$emit('enter',this.detail);
          }

          //指派
          if(this.type === 'dispatch'){
            res = await this.$api.assignTask(this.updateModel);
            this.$emit('enter','reload');
          }

          //领取
          if(this.type === 'get'){
            res = await this.$api.receiveTask(this.updateModel);
            this.$emit('enter','reload');
          }

          //新建
          if(this.type === 'new'){
            res = await this.$api.createSource(this.updateModel);
            this.$emit('enter','reload');
          }

        } catch (e) {
          this.$alert(res.msg);
          this.loading = false;
        }
        this.loading = false;
      },

      checkVaild (){

        if (this.updateModel.name === "") {
          this.$alert('请输入任务源名称'); return false;
        }
        if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(this.updateModel.name)) {
          this.$alert('任务源名称只能输入英文、中文和数字'); return false;
        }
        if (this.updateModel.description && this.updateModel.description.length > 300) {
          this.$alert('任务源描述长度超出限制'); return false;
        }

        if (moment(this.updateModel.beginDate).isBefore(moment().format('YYYY-MM-DD'))) {
          this.$alert('开始日期不能小于今日'); return false;
        }

        if (moment(this.updateModel.endDate).isBefore(this.updateModel.beginDate)) {
          this.$alert('结束日期不能早于开始日期'); return false;
        }

        //指派 必选负责人
        if((this.type === 'dispatch') && !this.updateModel.manager){
          this.$alert('请选择负责人'); return false;
        }

        return true;
      },
    }
  }
</script>
