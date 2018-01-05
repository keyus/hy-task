<template>
  <header class="task-header">
    <nav>
      <router-link to="/mytask" :class="{active : active.mytask}">我的任务</router-link>
      <router-link to="/center" :class="{active : active.center}">任务中心</router-link>
      <router-link to="/count"  :class="{active : active.count}">统计分析</router-link>
    </nav>
    <section class="search">
      <input type="text" placeholder="搜索任务名称" v-model="keyword" @keyup.enter="search" class="search-input">
      <button @click="search"></button>
    </section>
  </header>
</template>

<script>
  export default {
    name: 'taskHeader',
    data() {
      return {
        keyword : ''
      }
    },
    computed : {
      active (){
        return {
          mytask : this.$route.path.toLowerCase() === '/mytask',
          center : this.$route.path.toLowerCase() === '/center',
          count : this.$route.path.toLowerCase() === '/count',
        }
      }
    },
    methods : {
      search(){
        if(!this.keyword) return ;
        this.$router.push(`/search?keyword=${this.keyword}`);
      }
    }
  }
</script>
