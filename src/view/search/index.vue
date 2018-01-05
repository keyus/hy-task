<template>
  <div class="mytask">
    <div class="task-back">

      <div class="task-back__search">
        <span>
          <input type="text" v-model="query.content" @keyup.enter="search" placeholder="搜索任务标题">
          <i class="iconfont icon-sousuo1" @click="search"></i>
        </span>
        <label>搜索结果{{totalCount || 0}}个</label>
      </div>

      <div class="task-back__right">
        <a @click="$router.go(-1)"><span class="iconfont icon-fanhui"></span>返回</a>
      </div>

    </div>

    <section class="search-card" v-scroll="scroll"
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
        pageCount   : 0,
        totalCount  : 0,
        //搜索参数
        query : {
          pageSize    : 10,
          pageNumber  : 1,
          userId      : this.$store.state.user.cn,
          content     : ''
        }
      }
    },
    computed : {
      isEmpty(){
        return !this.list || !this.list.length
      }
    },
    watch : {
      '$route' (val) {
        if(val && val.query.keyword && val.query.keyword){
          this.query.content = val.query.keyword;
          this.init();
        }
      }
    },
    created () {
      if(this.$route.query && this.$route.query.keyword){
        this.query.content = this.$route.query.keyword;
        this.init();
      }
    },
    methods : {
      async init(){
        this.loading    = true;
        this.query.pageNumber = 1;
        try{
          let list          = await this.$api.search(this.query);
          this.list         = list.data.result.results;
          this.pageCount    = list.data.result.pageCount;
          this.totalCount   = list.data.result.totalCount;
        } catch (e){}
        this.loading      = false;
      },

      scroll (){
        if(this.pageCount <= this.query.pageNumber) return ;
        this.query.pageNumber += 1;
        this.loadNextPage();
      },

      async loadNextPage (){
        this.loadingNext = true;
        try{
          let list      = await this.$api.search(this.query);
          this.list       = this.list.concat(list.data.result.results);
        } catch (e) {}
        this.loadingNext    = false;
      },

      search(){
        if(!this.query.content) {
          this.list = [];
          return ;
        }
        this.$router.push(`/search?keyword=${this.query.content}`);
      },
    }
  }
</script>
