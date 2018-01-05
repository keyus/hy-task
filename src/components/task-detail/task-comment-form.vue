<template>
    <div class="detail-area-comment__form">
        <div class="detail-area-comment__form--input">
            <div class="user-icon">
                <task-avatar :avatar="user"></task-avatar>
            </div>
            <div class="detail-area-comment__form--right">
                <div class="detail-area-comment__form--area">
                    <textarea :maxlength="max" :placeholder="tip" v-model="text"></textarea>
                    <label>{{text.length}} / {{max}}</label>
                </div>

                <div class="detail-area-comment__form--handle">
                    <div class="detail-area-comment__form--file" v-if="allowUpload">
                        <file v-model="files" :is-end="isEnd"></file>
                    </div>
                    <div class="bnt">
                        <div class="detail-area-comment__form--end"
                             v-if="allowUpload">
                            <hy-checkbox v-model="isEnd">标记为最终版</hy-checkbox>
                        </div>
                        <div class="detail-area-comment__form--submit" v-loading="loading" :class="{'flex-auto' : !allowUpload}">
                            <button @click="createComment">发表</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import file from './task-file.vue'

    export default {
        components : {
            file
        },
        name : 'taskCommentForm',
        props : {
            tip : {
                type : String,
                default : '添加回执'
            },
            /**任务ID*/
            taskId : {
                type : [String,Number],
                default : null
            },
            /**是否允许上传，DOM节点显示*/
            allowUpload : {
                type : Boolean,
                default : true
            },
            /**最大输入*/
            max : {
                type : [String,Number],
                default : 300
            },
            /**文件上传数量*/
            fileNum : {
                type : [String,Number],
                default : 5
            },
            /**附件上传大小 MB*/
            fileSize : {
                type : [String,Number],
                default : 10
            }
        },
        data() {
            return {
                loading : false,
                /**是否最终版本*/
                isEnd : false,
                /**回复内容*/
                text : '',
                /**文件列表*/
                files : [],
            }
        },
        computed : {
            ...mapState({
              user : 'user'
            }),
            /**回执发送数据*/
            form () {
                return {
                    content : this.text,
                    fileNames :[...this.files],
                    taskId : this.taskId,
                    userId : this.user.cn,
                }
            }
        },
        watch : {

        },
        created () {
        },
        methods : {
            /**创建回执内容*/
            async createComment () {
                if(!this.text) {
                    this.$alert('请输入回执内容');
                    return ;
                }
                this.loading = true;
                try{
                    let res = await this.$api.createComment(this.form);
                        res.code === 200 && this.$emit('create-comment',res.data);
                        this.text = '';
                        this.files= [];
                    this.loading = false;
                } catch (error) {
                    this.loading = false;
                    this.$alert('添加回执失败');
                }
            },

        },


    }
</script>
