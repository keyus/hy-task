<template>
  <div class="task-toolbar source-toolbar">
    <a href="javascript:;" @click="submit" v-if="btns.submit"><span class="iconfont icon-jian-copy"></span>提交</a>
    <a href="javascript:;" @click="submit" v-if="btns.create"><span class="iconfont icon-wochuangjian"></span>创建</a>
    <a href="javascript:;" @click="cancle" v-if="btns.cancle"><span class="iconfont icon-guanbi"></span>取消</a>
  </div>
</template>

<script>
  export default {
    name : 'taskSourceToolbar',
    props : {
      type : {
        type : [String,Boolean],
        default : null
      },
      isCreator : {
        type : Boolean,
        default : false
      }
    },
    computed : {
      btns (){
        let btns = {
          submit : false,
          cancle : false,
          create : false,
        }
        //查看且创建人 或 指派，领取
        if( (!this.type && this.isCreator) || (this.type === 'dispatch' || this.type === 'get')) {
          ['submit','cancle'].forEach(key=>btns[key]=true)
        }
        //创建
        if(this.type === 'new') {
          ['create','cancle'].forEach(key=>btns[key]=true)
        }
        return btns;
      }
    },
    methods : {

      submit(){
        this.$emit('submit');
      },
      cancle(){
        this.$emit('close');
      },

    }
  }
</script>
