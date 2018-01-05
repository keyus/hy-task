<template>
    <section class="detail-area-child" v-if="visable || hasTaskchild">
        <!--工具条-->
        <div class="detail-area-child__bar" @click="showlist = !showlist">
            <div class="detail-area-child__bar--title">
                <span>子任务</span>
                <span>{{end}}/{{taskChild.length}}</span>
            </div>
            <div class="detail-area-child__bar--right">
                <span class="iconfont icon-jia" v-if="editable" @click.stop="showAdd()"></span>
                <span class="iconfont"
                      :class="{'icon-shang': !showlist,'icon-you' : showlist}"></span>
            </div>
        </div>

        <!--列表-->
        <div class="detail-area-child__list" v-show="showlist">
            <div class="detail-area-child__list--add" v-loading="loading" v-show="showAddInput">
                <input type="text"
                       v-model="formName"
                       @blur="save"
                       maxlength="20"
                       placeholder="请输入任务名称" />
                <label>{{formName.length}} / 20</label>
            </div>
            <ul>
                <li v-for="it in taskChild" @click="loadTaskChild(it)">
                    <div class="detail-area-child__list--left">
                        <span class="name">{{it.name}}</span>
                        <span class="rate">{{it.rate}}%</span>
                    </div>
                    <div class="detail-area-child__list--right">
                        <span class="person">{{it.creator.userName}}</span>
                        <span class="time">{{it.createTime}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
  /***
   * 重载任务列表，父组件实现init方法来重载
   */

  import { mapState } from 'vuex'
    export default {
        name : 'taskChild',
        props :{
            /**组件是否可见*/
            visable : {
                type : [Boolean,Number],
                default : false
            },
            editable :{
                type : Boolean,
                default : false,
            },
            /**任务ID*/
            taskId : {
                type : [String,Number],
                default : ''
            },

        },
        data() {
            return {
                /**是否有子任务*/
                hasTaskchild : false,
                /**是否显示子任务列表*/
                showlist : false,
                /**是否显示添加子任务input*/
                showAddInput : false,
                /**添加子任务表单v-model名字*/
                formName : '',
                /**子任务列表*/
                taskChild : [],
                loading : false
            }
        },
        watch : {
            /**如果visable发生变化，响应是否显示子任务*/
            visable (val) {
                val ? (this.hasTaskchild = true) : (this.hasTaskchild = false);
            },
            /**子任务列表有数据- 显示子任务组件*/
            taskChild (val) {
                if(val && val.length) {
                    this.hasTaskchild = true;
                    this.$emit('update:visable',true);
                }
            },

        },
        computed : {
            ...mapState({
              user : 'user',
            }),
            //完结子任务的数量
             end () {
                 if(this.taskChild && this.taskChild.length){
                     let arr = this.taskChild.filter(it=>{
                         return it.status === 3
                     });
                     return arr.length;
                 }
                 return 0;
             }
        },

        created () {
            this.init();
        },

        methods : {
            /**初始化数据*/
            async init () {
                try{
                    let res = await this.$api.taskChild(this.taskId);
                    this.taskChild = res.data || [];
                } catch (error) {}

            },
            showAdd () {
                this.showlist = true;
                this.showAddInput = true;
            },
            async save(){
                if(this.formName === ''){
                  this.showAddInput = false;
                  return ;
                }
                if(this.formName && /^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(this.formName)){
                    try{
                        this.loading = true;
                        let res = await this.$api.taskChildAdd({
                            name : this.formName,
                            userId : this.user.cn,
                            parentId : this.taskId
                        });
                        this.loading = false;
                        this.taskChild.unshift(res.data);
                        this.formName = '';
                        this.showAddInput = false;
                    } catch (error) {
                        this.loading = false;
                        this.$alert('添加任务失败');
                    }
                    return ;
                }
                this.$alert('子任务名称只能输入英文、中文和数字');
            },
            async loadTaskChild(it){
              try{
                await this.$taskDialog({ taskId : it.id , isChild : true});
                this.$emit('reload');
              } catch (e) {
                !e && this.$emit('reload');
              }
            }
        }
    }
</script>
