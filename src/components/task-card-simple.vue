<!--我的任务  新建页面  任务卡片-->

<template>
  <div class="task-card-simple">

    <!--主任务-->
    <div class="task-card-simple-main">
      <div class="task-card-simple__box">
        <span class="name">{{item.name}}</span>
        <span class="user">{{item.creator ? item.creator.userName : ''}}</span>
        <span class="time">{{item.createTime|formatDate}}</span>
      </div>

      <div class="task-card-simple__add">
        <a @click="showForm">
          <span class="iconfont icon-jia1"></span>
          <span>子任务</span>
        </a>
      </div>
    </div>

    <!--子任务-->
    <div class="task-card-simple-children" v-if="item.children">
        <task-card-simple v-for="it in item.children"
                          :key="it.id"
                          :item="it"></task-card-simple>
    </div>

    <!--内部表单，并没有与taskcreate-form重用-->
    <div class="create-form" v-if="createFormVisible">
      <div class="create-form__user">
        <span class="img" v-avatar="user.sex" :head="user.head"></span>
        <span class="name">{{user.userName}}</span>
      </div>
      <div class="create-form__input" v-loading="loading">
        <div class="create-form__input-area">
          <textarea placeholder="请输入任务名称" ref="textarea" v-model="query.name" rows="3" maxlength="20" @blur="create"></textarea>
          <a class="close iconfont icon--close" @mousedown="clear"></a>
          <label class="limit">{{query.name.length}} / 20</label>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import bus from '../mixin/bus'

  export default {
    name: 'taskCardSimple',
    props : {
      item : {
        type : Object,
        default(){ return {} }
      }
    },
    computed : {
      user (){
        return this.$store.state.user;
      }
    },
    data () {
      return {
        loading : false,
        createFormVisible : false,
        //是否正在清除textarea内容
        isClear : false,
        query : {
          name : '',
          parentId : this.item.id,
          userId : this.$store.state.user.cn
        }
      }
    },
    methods : {
      showForm(){
        this.createFormVisible = true;
        this.$nextTick(()=>{
          this.$refs.textarea.focus();
        })
      },
      async create(){
        if(this.isClear){
          this.isClear = false;
          this.$refs.textarea.focus();
          return ;
        }
        if(this.query.name === '') {
          this.createFormVisible = false;
          return ;
        }
        if(/^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(this.query.name) && this.query.name.length<=20){
          this.loading = true;
          try{
            let res   = await this.$api.createTask(this.query);
            this.createFormVisible = false;
            this.query.name = '';
            bus.$emit('add-children',this.item,res.data);
          } catch (e) {
          }
          this.loading = true;
        }else {
          this.$alert('任务名称只能输入英文、中文和数字');
        }
      },
      clear(){
        this.query.name ='';
        this.isClear    = true;
        return ;
      }
    },
    filters : {
      formatDate (val){
        return moment(val).format('YYYY-MM-DD');
      }
    }
  }
</script>
