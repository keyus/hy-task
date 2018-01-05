<template>
  <transition name="slide-in">
    <div class="task-center-member" v-if="visible" ref="taskMember" v-clickoutside="otherClickHide">
      <h5>成员 <a @click="close"><span class="iconfont icon-tianjiajiahaowubiankuang"></span></a></h5>
      <div class="task-center-member__list" v-loading="loading">
        <ul>
          <li v-for="it in list">
            <a @click="openSession(it)">
              <span class="avatar" v-avatar="it.member.sex"
                    :head="it.member.head"></span>
              <span class="text">{{it.member.userName}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name : 'taskCenterMember',
    props : {
      visible : {
        type : Boolean,
        default : false
      }
    },
    data (){
      return {
        loading : false,
        list : []
      }
    },
    computed : {
      ...mapState({
        centerId : 'centerId'
      })
    },
    watch : {
      visible(val){
        val && this.init();
      },

    },
    methods : {
      async init (){
        this.loading = true;
        try {
          let list = await this.$api.getTaskCenterMember(this.centerId);
          this.list = list.data;
          this.loading = false;
        } catch (e){
          this.loading = false;
        }
      },

      //点击其它区域隐藏
      otherClickHide(){
          this.close();
      },

      close (){
        this.$emit('update:visible',false);
      },

      //打开终端会员窗口
      openSession(item){
        try{
          Cef.ShowChatFrom(item.member.cn);
        } catch (e){
          console.log(e);
        }
      }

    }
  }
</script>
