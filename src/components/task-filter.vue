<template>
  <div class="section-filter">

    <div class="section-filter__bd"
         :class="{ active : extend }"
         @click="toggle($event)">
      <span class="icon-filter iconfont icon-fenlei"></span>
      <span class="text">筛选</span>
      <span class="arrow iconfont icon-you1"></span>
    </div>

    <div class="section-filter__center"
         ref="center"
         v-clickoutside="clickoutside"
         v-if="center.length">

      <div @click="centerExtend = !centerExtend" class="current-center">
        <span>{{currentCenter ? currentCenter.name : ''}}</span>
        <span class="iconfont icon-xia"></span>
      </div>

      <ul v-show="centerExtend">
        <li v-for="it in center" @click="selectCenter(it)">
          {{it.name}}
          <i v-if="it.active" class="iconfont icon-zhengque1"></i>
        </li>
      </ul>
    </div>

    <div class="section-filter__hd">
      <a @click="createTask"><span class="iconfont icon-jia1"></span>新建</a>
      <router-link v-if="isCenter" to="/create-center">设置</router-link>
      <a v-if="center.length" @click="showTaskMember"><i class="iconfont icon-renyuanchaxun"></i>{{currentCenter ? currentCenter.membersCount : ''}}人</a>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'taskFilter',
    props : {
      //是否显示成员
      showMember : {},
      center : {
        type : Array,
        default(){ return [] }
      }
    },
    data() {
      return {
        //filter展开状态
        extend        : false,
        //当前任务中心
        centerExtend  : false,
        isInit        : true,
      }
    },

    computed : {
      currentCenter(){
        if(this.isInit && Array.isArray(this.center) && this.center.length) {
          this.isInit = false;
          this.$set(this.center[0],'active',true);
          return this.center[0];
        }else{
          if(Array.isArray(this.center) && this.center.length){
            return this.center.find(it=>it.active);
          }
          return {};
        }
      },
      //是否是任务中心
      isCenter () {
        return this.$route.name === 'center';
      },
      //是否是我的任务
      isMytask () {
        return this.$route.name === 'mytask';
      },
      //返回对应的过滤器参数 query
      filter(){
        if(this.isCenter){
          return this.$store.state.taskCenterFilter
        }else{
          return this.$store.state.myTaskFilter
        }
      },
    },

    watch : {
      currentCenter (val){
        val && this.$store.commit('updateCenterId',val.id);
      },
    },
    methods : {
      //选择任务中心
      selectCenter(item){
        let is    = this.center.find(it=>it.active);
        if(is) is.active = false;
        this.centerExtend   = false;
        this.$set(item,'active',true);
        this.$store.commit({ type : 'updateFilter', data : {id : item.id},  name : 'taskCenterFilter' });
        this.$emit('change-center');
      },
      //隐藏任务中心下拉
      clickoutside(){
        this.centerExtend   = false;
      },

      //显示成员
      showTaskMember(){
        this.$emit('update:showMember',!this.showMember);
      },
      //判断跳转
      async createTask (){
        if(this.isMytask){
          this.$router.push('/create');
          return ;
        }
        let options = {
          type : 'new',
          centerName : this.currentCenter.name
        };

        try{
          await this.$taskSourceDialog(options);
          this.$store.commit('updateReloadCenter',true);
        } catch (e) {}
      },

      //弹出筛选框
      async toggle(e){
        let extend = this.extend;
        if(extend) {
          this.extend = false;
        }else{
          this.extend = true;
          let ele = e.currentTarget;
          try{
            let storeStateName  = 'myTaskFilter';  //默认更新store中的 myTaskFilter state
            if(this.isCenter)  {
              storeStateName    = 'taskCenterFilter';
            }
            let filter             = await this.$taskFilterDialog(ele,this.filter,this.isCenter);
            this.extend         = false;
            this.$store.commit({
              type : 'updateFilter',
              data : filter,
              name : storeStateName
            });
            this.$emit('run-filter');
          } catch (err){
            this.extend = false;
          }
        }
      }


    }
  }
</script>
