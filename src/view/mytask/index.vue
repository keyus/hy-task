<template>
  <div class="mytask">
    <task-header></task-header>
    <task-filter @run-filter="init"></task-filter>

    <section class="section-card"
             v-scroll="scroll"
             v-loading="loading"
             loading-background="rgba(255,255,255,1)">
      <div class="empty" v-if="isEmpty"></div>
      <task-card v-for="item in list" :key="item.taskId" :item="item"></task-card>
      <div class="loading"
           loading-text="拼命加载中"
           v-loading="loadingNext">
      </div>
    </section>

  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data (){
      return {
        loading     : false,
        loadingNext : false,
        list        : [],
        pageCount   : 0
      }
    },
    computed : {
      isEmpty(){
        return !this.list || !this.list.length;
      },
      ...mapState({
        query : 'myTaskFilter'
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
        this.$store.commit({ type : 'updateFilter', data : {pageNo : 1},  name : 'myTaskFilter' });
        try{
          let list      = await this.$api.getMyTaskList(this.query);
          this.list       = list.data.result.results;
          this.pageCount  = list.data.result.pageCount;
        } catch (e){}
        this.loading    = false;
      },

      scroll (){
        if(this.pageCount <= this.query.pageNo) return ;
        let pageNo = this.query.pageNo+1;
        this.$store.commit({ type : 'updateFilter', data : {pageNo},  name : 'myTaskFilter' });
        this.loadNextPage();
      },

      //加载下一页
      async loadNextPage (){
        this.loadingNext = true;
        try{
          let list      = await this.$api.getMyTaskList(this.query);
          this.list       = this.list.concat(list.data.result.results);
        } catch (e) {
        }
        this.loadingNext    = false;
      },
    }
  }
</script>
