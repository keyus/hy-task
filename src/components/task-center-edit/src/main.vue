<template>
  <div class="dialog" v-if="visible">
    <div class="mask">
      <div class="task-center-edit">

        <div class="dialog-title">
          <span class="dialog-title__logo"></span>设置任务中心
          <a @click="close(true)" class="iconfont icon--close"></a>
        </div>
        <div v-loading="loading">
          <div class="task-center-edit__body">

            <div class="task-center-edit__form-group">
              <label class="label">任务中心名称</label>
              <div class="block-right">
                <input type="text" maxlength="20"
                       :class="{ 'input-error' : nameError}"
                       @focus="nameError = false"
                       v-model="detail.name"
                       placeholder="请输入任务名称">
              </div>
            </div>

            <div class="task-center-edit__form-group task-center-edit__form-select">
              <label class="label">选择使用范围</label>
              <div class="block-right">
                <task-select-user :user="user"
                                  :class="{ 'select-error' : membersError}"
                                  v-model="detail.members"></task-select-user>
              </div>
            </div>

            <div class="task-center-edit__form-group">
              <label class="label">管理员</label>
              <div class="block-right">
                <task-select-user :user="user" v-model="detail.manager" type="one"></task-select-user>
              </div>
            </div>

            <div class="task-center-edit__form-group">
              <label class="label">来源设置</label>
              <div class="block-right">
                <hy-checkbox v-model="detail.publicEmail" :true-label="1" :false-label="0">公共邮箱</hy-checkbox>
              </div>
            </div>

            <div class="task-center-edit__form-group task-center-edit__form-bang">
              <label class="label">绑定公共邮箱</label>
              <div class="block-right">
                <div class="email-title">常规设置</div>

                <div class="task-center-edit__form-child">
                  <label class="child-label">Email地址</label>
                  <span>
                    <input type="text"
                           @focus="emailError = false"
                           v-model="detail.email"
                           :disabled="disabledEmail"
                           :class="{ 'input-error' : emailError}">
                  </span>
                </div>

                <div class="task-center-edit__form-child">
                  <label class="child-label">密码</label>
                  <span>
                    <input type="password"
                           @focus="emailPasswordError = false"
                           v-model="detail.emailPassword"
                           :disabled="disabledEmail"
                           :class="{ 'input-error' : emailPasswordError}">
                  </span>
                </div>

              </div>
            </div>

          </div>

          <div class="task-center-edit__foot">
            <button @click="save">确定</button>
            <button @click="close">取消</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'taskCenterEdit',
    data() {
      return {
        //显隐
        visible : false,
        loading : false,
        user    : {},

        //名称是否出错
        nameError : false,
        membersError : false,
        //邮箱
        emailError : false,
        //邮箱密码
        emailPasswordError : false,
        //禁止编辑邮箱
        disabledEmail : false,


        detail  : {
          name  : '',
          email : '',
          publicEmail : 1,
          personalEmail : '',
          emailPassword : '',
          manager : {},
          members : [],
          synDelete : null,
          intervalTime : null,
          autoReceive  : 0,
          id : ''
        },
      }
    },
    computed : {
      query () {
        let members = [];
        this.detail.members.forEach(it=>{
          members.push(it.cn);
        });
        return {
          autoReceive   : this.detail.autoReceive,
          email         : this.detail.email,
          emailPassword : this.detail.emailPassword,
          id            : this.detail.id,
          intervalTime  : this.detail.intervalTime,
          members       : members.join(','),
//          manager       : this.detail.manager.cn,
          name          : this.detail.name,
          publicEmail   : this.detail.publicEmail,
          synDelete     : this.detail.synDelete,
          userId        : this.user.cn,
        };
      }
    },
    created (){
      if(this.id) this.init();
    },
    watch : {
      visible(val){
        if(!val){
          this.$nextTick(()=>{
            this.$destroy();
          });
        }
      },
      'detail.members' (val){
        if(Array.isArray(val) && val.length) this.membersError = false;
      },
      'detail.publicEmail'(val){
        this.disabledEmail = !val;
        if(!val){
          this.emailError         = false;
          this.emailPasswordError = false;
        }
      }
    },
    methods : {

      async init (){
        try{
          this.loading  = true;
          let res       = await this.$api.getTaskCenterDetail(this.id);
          this.detail   = res.data;
          this.loading  = false;
        }catch (e){ this.loading  = false; }
      },

      //保存
      async save (){
        if(!this.isVaild()) return ;
        this.loading = true;
        try{
          if(!this.query.id){
            //创建
            let res         = await this.$api.createTaskCenter(this.query);
            if(res.code !== 200){
              this.emailError = true;
              this.$alert(res.msg);
            }else{
              this.query.id   = res.data.id;
              this.$emit('enter',this.query);
            }
            this.loading = false;
            return ;
          }
          //编辑
          await this.$api.updateTaskCenter(this.query);
          this.loading = false;
          this.$emit('enter',this.query);
        }catch (e){
          this.loading = false;
        }
      },

      //检查是否有效
      isVaild (){
        let vaild = true;

        if(!/^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(this.query.name.trim())){
          this.$alert('任务中心名称只能输入英文、中文和数字');
          this.nameError = true;
          return false;
        }

        if(!this.query.members || !this.query.members.length) {
          this.$alert('请选择使用范围');
          this.membersError = true;
          return false;
        }
        if(this.query.publicEmail) {
          if (this.query.email === "") {
            this.$alert('请输入Email地址');
            this.emailError = true;
            return false;
          }
          if (!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.query.email)) {
            this.$alert('你设置的邮箱不能正常使用，请修改邮箱设置');
            this.emailError = true;
            return false;
          }
          if (this.query.emailPassword === "") {
            this.emailPasswordError = true;
            this.$alert('请输入邮箱密码');
            return false;
          }
        }

        return vaild;
      },

      async close(e){
        if(e === true){
          try{
            if(this.detail.name || (Array.isArray(this.detail.members) && this.detail.members.length)){
              await this.$confirm('是否将更改保存？');
              this.save();
              return ;
            }
            this.$emit('close');
          } catch (err){
            this.$emit('close');
          }
        }else{
          this.$emit('close');
        }
      }
    }
  }
</script>
