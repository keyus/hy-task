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
                    <div class="bnt">
                        <div class="detail-area-comment__form--submit flex-auto" v-loading="loading">
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
    export default {
        name : 'taskCommentFormSimple',
        props : {
            tip : {
                type : String,
                default : '添加评论'
            },
            /**评论ID*/
            commentItem : {
                default : null
            },
            /**最大输入*/
            max : {
                type : [String,Number],
                default : 300
            },
        },
        data() {
            return {
                /**回复内容*/
                text : '',
                loading : false
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
                    responseId : this.commentItem.id,
                    userId : this.user.cn
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
                    this.$alert('请添加评论');
                    return ;
                }
                this.loading = true;
                try{
                    let res = await this.$api.createCommentChild(this.form);
                        res.code === 200 && this.$emit('create-comment',this.commentItem,res.data);
                        this.text = '';
                    this.loading = false;
                } catch (error) {
                    this.loading = false;
                    this.$alert('添加评论失败');
                }
            }
        },


    }
</script>
