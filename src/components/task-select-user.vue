<template>
  <div class="task-select-user" :class="{'not-select-user': !editable}">
    <!--多人-->
    <template v-if=" type === 'more' ">
      <div class="task-select-user__handle"
           @click="selectUser"
           :class="{ 'not-select' : !editable }">
        <i class="iconfont icon-tianjia"></i>
        <em v-if="!list.length">可选择人员</em>
      </div>

      <span v-for="it in list.slice(0,maxShow2)">
        <label>{{it.userName}}</label>
        <i class="iconfont icon--close" v-if="editable" @click="delItem(it)"></i>
      </span>

      <a v-show="isMore" @click="toggle">
        <template v-if="extend">收起</template>
        <template v-else>更多...</template>
      </a>
    </template>

    <!--单人-->
    <template v-else>

      <!--默认样式-->
      <div class="user-one" v-if="typeStyle2 !== 'more' " @click="selectUser">
          <div class="user-one-name">{{list.userName}}</div>
          <div class="user-one-icon iconfont icon-edit" v-if="editable"></div>
      </div>

      <!--多人样式-->
      <div class="task-select-user__handle"
           v-else
           :class="{ 'not-select' : !editable }"
           style="color: #63b0f6"
           @click="selectUser">

        <i class="iconfont icon-tianjia" v-if="!list.userName"></i>

        <template v-else>
          {{list.userName}}
          <div class="user-one-icon iconfont icon-edit" v-if="editable"></div>
        </template>

      </div>
    </template>

  </div>
</template>

<script>
  export default {
    name: 'taskSelectUser',
    props : {
      //最大选择数量
      maxNum  : {
        type : [Number,String],
        default : 50,
      },
      //最大显示数量
      maxShow : {
        type : [Number,String],
        default : 5
      },
      //是否禁止编辑-则显示图片为灰色
      disabled : {
        type : Boolean,
        default : false
      },
      //是否允许选择管理
      editable : {
        type : Boolean,
        default : true
      },
      //类型：多人与单人    more|one
      type : {
        type : String,
        default : 'more'
      },
      //样式- 设置type = one 时生效
      typeStyle : {
        type : String,
        default : ''
      },
      //members数据
      value : {},
      //当前登陆用户信息-必传
      user : {},
      //禁止选择的用户ID，
      excludeUser : {
        type : Array,
        default (){
          return []
        }
      },
      //禁止选择时提示语
      excludeTip : {
        type : [String,Number],
        default : '有禁此选择的用户'
      },
    },
    computed : {
      isMore(){
        return this.maxShow < this.list.length;
      },
      isEmpty(){
        return !this.list.length;
      },
    },
    watch : {
      //展开状态
      extend (val){
        if(this.isMore){
          if(val){
            this.maxShow2 = this.list.length;
          }else{
            this.maxShow2 = this.maxShow;
          }
        }
      },
      //监听value member会员变动赋值
      value : {
        immediate : true,
        handler(val){
          if(this.type==='one' && !val){
            this.list = {};
            return ;
          }
          this.list = val;
        }
      }
    },
    data() {
      return {
        //数据组
        extend      : false,
        list        : [],
        maxShow2    : this.maxShow,
        typeStyle2  : this.typeStyle,
      }
    },
    methods : {
      //选择组织架构人员
      async selectUser(){
        if(!this.editable) return ;
        try{
          let max = this.maxNum;
          if(this.type === 'one') max = 1;

          let select = await this.$transferCompany({
            max             : max ,
            fromJid         : this.user.cn,
            token           : '111111',
            depid           : this.user.companyId
          });
          //处理数据格式
          select.users.forEach( it => {
            it.cn       = it.jid.split('@')[0];
            it.userName = it.name;
          });
          if(!this.isVaild(select.users)) {
            this.$alert(this.excludeTip);
            return ;
          }

          //多人
          if(this.type === 'more'){
            //添加数据去重复
            select.users.forEach( it => {
              if(!this.list.find(item => item.cn == it.cn) && this.list.length < this.maxNum){
                this.list.push(it);
              }
            });
            this.$emit('input',this.list);
          }
          //单人
          else {
            this.list = select.users[0];
            this.$emit('input',this.list);
          }

        } catch (e) {}
      },

      //切换
      toggle (){
        this.extend = !this.extend;
      },

      //删除项
      delItem(item){
        this.list.splice(this.list.indexOf(item),1)
      },

      //检测是否为有效数据
      isVaild(data) {
        let vaild = true;
        if(this.excludeUser.length){
          data.forEach(it=>{
            let cn = it.cn;
            if(this.excludeUser.find(id=> cn == id)){
              vaild = false;
            }
          });
        }
        return vaild;
      }


    }
  }
</script>
