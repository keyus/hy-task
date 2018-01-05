<template>
  <div class="view-nav">
    <div class="view-nav-wrapper">
      <router-link :to="{path : 'view' , query: { taskId } }" @click.native="animation(0)">动态</router-link>
      <router-link :to="{path : 'view' , query: { taskId } }" @click.native="animation(1)">结构</router-link>
      <router-link :to="{path : 'view' , query: { taskId } }" @click.native="animation(2)">回执</router-link>
      <router-link :to="{path : 'view' , query: { taskId } }" @click.native="animation(3)">附件</router-link>
      <span class="bottom-solid" :style="style"></span>
    </div>
    <div class="view-group">
      <a><i class="iconfont icon-renyuanchaxun"></i>工作组</a>
    </div>
  </div>
</template>

<script>
  export default {
    name :'viewNav',
    props : {
      taskId : {}
    },
    data () {
      return {
        style : ''
      }
    },
    methods : {
      animation(val){
        let width  = 80;
        this.style = `transform: translateX(${ val * width }px);`;
      }
    }
  }
</script>
