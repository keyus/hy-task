<template>
  <div class="mytask">
    <div class="task-back">
      <div class="task-back__right">
        <router-link to="/mytask"><span class="iconfont icon-fanhui"></span>返回</router-link>
      </div>
    </div>

    <div class="create-list">
      <div class="list-card-simple">
        <task-card-simple v-for="it in list"
                          :key="it.id"
                          :item="it"></task-card-simple>
      </div>

      <task-create-form @create="addItem" :visible.sync="createFormVisible"></task-create-form>

      <div class="create-handle" v-if="!createFormVisible">
        <a @click="createFormVisible = !createFormVisible">
          <span class="iconfont icon-jia1"></span>
          <span class="text">添加任务</span>
        </a>
      </div>

    </div>
  </div>
</template>

<script>

  import bus from '../../mixin/bus'

  export default {
    data() {
      return {
        list : [],
        createFormVisible : true
      }
    },
    created (){
      if(!bus._events['add-children']){
        bus.$on('add-children',this.addChildren);
      }
    },
    methods : {
      //添加主任务
      addItem(item){
        if(typeof item !== 'object') return ;
        this.list.push(item);
      },
      //添加子任务
      addChildren (item,data){
        if(!item.hasOwnProperty('children')){
          this.$set(item,'children',[])
        }
        item.children.push(data);
      },
    }

  }
</script>
