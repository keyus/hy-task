<template>
  <div class="mytask">
    <task-header></task-header>
    <task-filter :center="center"
                 :show-member.sync="showMember"
                 @run-filter="init"
                 @change-center="init"></task-filter>

    <task-center-member :visible.sync="showMember"></task-center-member>

    <section class="section-card"
             v-scroll="scroll"
             loading-background="rgba(255,255,255,1)"
             v-loading="loading">
      <div class="empty" v-if="isEmpty"></div>
      <task-card v-for="item in list"
                 @reload="init"
                 :key="item.id"
                 :item="item"></task-card>
      <div class="loading"
           loading-text="拼命加载中"
           v-loading="loadingNext">
      </div>
    </section>


  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import queryString from 'query-string'
  import taskCenterMember from './task-center-member.vue'

  export default {
    components : {
      taskCenterMember
    },
    data (){
      return {
        loading     : false,
        loadingNext : false,
        //任务列表
        list        : [],
        //分页总数
        pageCount   : 0,
        //任务中心名称列表
        center      : [],
        //任务中心成员列表状态
        showMember  : false,
        //第一次加载
        firstload   : true,
      }
    },
    computed : {
      isEmpty() {
        return !this.list || !this.list.length
      },
      ...mapState({
        query         : 'taskCenterFilter',
      })
    },
    created () {
      this.init();
    },
    methods : {
      async init(){
        this.loading    = true;
        this.list       = [];
        this.pageCount  = 0;
        this.$store.commit({ type : 'updateFilter', data : {pageNo:1},  name : 'taskCenterFilter' });
        try{
          //是否拉取任务池
          if(!this.center.length){
            let center      = await this.$api.getTaskCenterName();
            this.center     = center.data;
            this.$store.commit({ type : 'updateFilter', data : {id : this.center[0].id },  name : 'taskCenterFilter' });
          }
          let list        = await this.$api.getTaskCenterList(this.query);
          this.list       = list.data.pageResult.results;
          this.pageCount  = list.data.pageResult.pageCount;
          this.firstload && this.rollsource();  //回朔
        } catch (e){}
        this.loading    = false;
      },

      scroll (){
        if(this.pageCount <= this.query.pageNo) return ;
        let pageNo = this.query.pageNo+1;
        this.$store.commit({ type : 'updateFilter', data : {pageNo},  name : 'taskCenterFilter' });
        this.loadNextPage();
      },

      async loadNextPage (){
        this.loadingNext = true;
        try{
          let list      = await this.$api.getTaskCenterList(this.query);
          this.list       = this.list.concat(list.data.pageResult.results);
        } catch (e) {}
        this.loadingNext    = false;
      },

      //回朔任务源
      async rollsource (){
        let urlQuery    = queryString.parse(location.href.split('?')[1]);
        /**url参数*/
        let taskId      = urlQuery.taskId;
        let centerId    = urlQuery.centerId;
        //同时有任务ID，任务池ID，则回朔
        if(taskId && centerId){
          let options = {
            type : undefined,
            taskId
          };
          try{
            await this.$taskSourceDialog(options);
            this.firstload = false;
            this.init();
          } catch (e){ }
        }
      }
    }
  }
</script>
