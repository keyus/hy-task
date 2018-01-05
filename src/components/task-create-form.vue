<template>
  <div class="create-form" v-if="visible">
    <div class="create-form__user">
      <span class="img" v-avatar="user.sex" :head="user.head"></span>
      <span class="name">{{user.userName}}</span>
    </div>
    <div class="create-form__input">
      <div class="create-form__input-area">
        <!--mousedown会优先于blur事件 so-->
        <textarea placeholder="请输入任务名称" ref="mainTextarea" autofocus v-model="query.name" rows="3" maxlength="20" @blur="create"></textarea>
        <a class="close iconfont icon--close" @mousedown="clear"></a>
        <label class="limit">{{query.name.length}} / 20</label>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'taskCreateForm',
    props : {
      visible : {}
    },
    computed : {
      user (){
        return this.$store.state.user;
      }
    },
    data() {
      return {
        //是否正在清除textarea内容
        isClear : false,
        query   : {
          name      : '',
          parentId  : '',
          userId    : this.$store.state.user.cn
        }
      }
    },
    watch : {
      visible : {
        immediate : true,
        handler(val){
          if(val){
            this.$nextTick(()=>{
              this.$refs.mainTextarea.focus();
            })
          }
        }
      }
    },
    methods : {
      async create (){
        if(this.isClear){
          this.isClear = false;
          this.$refs.mainTextarea.focus();
          return ;
        }
        if(this.query.name === '') {
          this.$emit('update:visible', false);
          return ;
        }
        if(/^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(this.query.name) && this.query.name.length<=20){
          try{
            let res   = await this.$api.createTask(this.query);
            this.query.name = '';
            this.$emit('create',res.data);
            this.$emit('update:visible', false);
          } catch (e) {

          }
        }else {
          this.$alert('任务名称只能输入英文、中文和数字');
        }
      },

      clear (){
        this.query.name ='';
        this.isClear    = true;
        return ;
      }
    }
  }
</script>
