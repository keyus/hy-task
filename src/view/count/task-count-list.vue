<template>
  <div class="count-list">
    <div class="count-list__title">
      <span>任务列表</span>
      <span>总数：{{totalCount}}</span>
    </div>
    <div class="count-list__head">
      <span class="name">任务名称</span>
      <span>负责人</span>
      <span>结束日期</span>
      <span>进度</span>
      <span>状态</span>
      <span>紧急程度</span>
    </div>

    <div class="count-list_content" v-loading="loading"
         loading-background="rgba(255,255,255,1)"
         v-scroll="scroll">
      <div class="empty" v-show="isEmpty"></div>
      <ul>
        <li v-for="it in list" :key="it.taskId">
          <span class="name">{{it.name}}</span>
          <span>{{it.userName}}</span>
          <span>{{it.endDate}}</span>
          <span>{{it.rate}}%</span>
          <span>{{it.status | situation}}</span>
          <span>{{it.urgency | urgency}}</span>
        </li>
      </ul>

      <div class="loading"
           loading-text="拼命加载中"
           v-loading="loadingNext">
      </div>
    </div>
  </div>


</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name : 'taskCountList',
    props : {
      selectList : {},
    },
    data (){
      return {
        loading : false,
        list : [],
        pageCount : 0,
        loadingNext : false,
        totalCount : 0
      }
    },
    created () {
      this.init();
    },

    watch : {
      selectList(val){
        if(val){
          this.init();
          this.$emit('update:selectList',false)
        }
      }
    },

    computed: {
      isEmpty(){
        return !this.list || !this.list.length;
      },
      ...mapState({
        filter : 'taskCountFilter'
      }),
    },
    methods : {
      async init(){
        this.$store.commit({ type : 'updateFilter', data : {pageNo : 1},  name : 'taskCountFilter' });
        this.loading = true;
        try{
          let res = await this.$api.getCountList(this.filter);
          this.list = res.data.tasks.results;
          this.pageCount  = res.data.tasks.pageCount;
          this.totalCount  = res.data.tasks.totalCount;
        }catch (e){}
        this.loading = false;
      },

      scroll (){
        if(this.pageCount <= this.filter.pageNo) return ;
        let pageNo = this.filter.pageNo+1;
        this.$store.commit({ type : 'updateFilter', data : {pageNo},  name : 'taskCountFilter' });
        this.loadNextPage();
      },

      async loadNextPage (){
        this.loadingNext = true;
        try{
          let res      = await this.$api.getCountList(this.filter);
          this.list       = this.list.concat(res.data.tasks.results);
        } catch (e) {}
        this.loadingNext    = false;
      }

    },

    filters : {
        //格式化status的文字
        formatStatus (val) {
          if(val ==1) return '参与的任务';
          if(val ==2) return '关注的任务';
          if(val ==3) return '负责的任务';
          if(val ==4) return '创建的任务';
        }
    }

  }
</script>
