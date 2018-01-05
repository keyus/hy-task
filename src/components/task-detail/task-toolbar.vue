<template>
  <div class="task-toolbar">
    <a href="javascript:;" v-if="btns.submit"   @click="submit"><span class="iconfont icon-jian-copy"></span>提交</a>
    <a href="javascript:;" v-if="btns.locked"   @click="handle(0)"><span class="iconfont icon-suo"></span>锁定</a>
    <a href="javascript:;" v-if="btns.unlocked" @click="handle(1)"><span class="iconfont icon-jiesuo_unlocked"></span>解锁</a>
    <a href="javascript:;" v-if="btns.finished" @click="setfinished"><span class="iconfont icon-crm17"></span>完结</a>
    <a href="javascript:;" v-if="btns.deleted"  @click="del"><span class="iconfont icon-shanchu"></span>删除</a>
  </div>
</template>

<script>
  import { mapGetters , mapState } from 'vuex'
  export default {
    name : 'taskToolbar',
    computed : {
      ...mapGetters({
        role    : 'taskRole',
        status  : 'taskStatus',
        taskId  : 'taskId',
      }),
      ...mapState({
        user    : 'user'
      }),
      btns () {
        let model = {
          submit    : false,
          locked    : false,
          unlocked  : false,
          finished  : false,
          deleted   : false,
        };
        let btn = [];
        //锁定
        if(this.status.locked)
        {
          //创建人
          if(this.role.creator){
            btn = ['submit','unlocked','deleted'];
            if(this.role.manager){
              btn = ['submit','unlocked','finished','deleted'];
            }
          }
          //负责人-非创建人
          if(this.role.manager && !this.role.creator){
            btn = ['finished'];
          }
          //参于人或关注人
          if((this.role.members || this.role.concerns) && !this.role.manager && !this.role.creator){
            btn = [];
          }
        }
        //完结
        if(this.status.finished)
        {
          if(this.role.creator || this.role.manager){
            btn = ['deleted'];
          }
        }
        //未完结-未锁定
        if(!this.status.finished && !this.status.locked)
        {
          //创建人
          if(this.role.creator){
            btn = ['submit','locked','deleted'];
            //同是负责人
            if(this.role.manager){
              btn = ['submit','locked','finished','deleted'];
            }
          }
          //负责人
          if(this.role.manager && !this.role.creator){
            btn = ['submit','deleted','finished'];
          }
          //参于人或关注人
          if((this.role.members || this.role.concerns) && !this.role.manager && !this.role.creator){
            btn = [];
          }
        }

        Object.keys(model).forEach(key=>{
          model[key] = false;
        });
        btn.forEach(key=>{
          model[key] = true;
        });
        return model;
      }
    },

    methods : {
      //提交
      submit() {
        this.$emit('submit');
      },
      //删除
      async del(){
        try{
          await this.$confirm('删除后无法恢复，您确定要删除吗？');
          await this.$api.updateState({
            type : 3,
            userId : this.user.cn,
            taskId : this.taskId,
          });
          this.$emit('close', 'delete');
        } catch (e){

        }
      },

      //完结
      async setfinished() {
        try{
          await this.$confirm('任务完结后将无法重置，你是否确定要完结任务？');
          await this.$api.updateState({
            type   : 2,
            userId : this.user.cn,
            taskId : this.taskId,
          });
          this.$emit('close', 'finished');
        } catch (e){

        }
      },

      //锁定，解锁
      async handle (type) {
        try{
          await this.$api.updateState({
            type,
            userId : this.user.cn,
            taskId : this.taskId,
          });
          let locked;
          if(type === 0) locked = 1;
          if(type === 1) locked = 0;
          this.$store.commit('locked',locked);
        } catch (e){}
      }

    }
  }
</script>
