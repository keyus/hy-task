<template>
  <div class="mytask">
    <div class="task-back">
      <div class="task-back__right">
        <router-link to="/center"><span class="iconfont icon-fanhui"></span>返回</router-link>
      </div>
    </div>

    <div class="create-center-list">
      <div class="create-center-list__handle">
        <a @click="edit()"><span class="iconfont icon-jia2"></span>新增</a>
      </div>

      <ul class="center-list-container">
        <li v-for="it in list" :key="it.id">
          <span class="name">{{it.name}}</span>
          <span class="handle">
            <a @click="edit(it)"><i class="iconfont icon-edit" ></i>修改</a>
          </span>
        </li>
      </ul>

    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        list : []
      }
    },
    created(){
      this.init();
    },
    methods : {
      async init(){
        try{
          let list  = await this.$api.getTaskCenterName();
          this.list = list.data;
        } catch (e){

        }
      },
      async edit(item){
        let data = Object.assign({},item);
        data.user = this.$store.state.user;
        if(!item){
          data.detail   = {};
          data.detail.manager  = data.user;
        }
        try{
          let res = await this.$taskCenterEdit(data);
          if(item){
            //更改项
            item.name = res.name;
          }else{
            //加入新项
            this.list.unshift(res);
          }
        }catch (e){
        }

      }
    }
  }
</script>
