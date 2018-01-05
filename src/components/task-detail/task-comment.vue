<template>
    <section class="detail-area-comment">
        <div class="detail-area-comment__bar" @click="showlist = !showlist">
            <div class="detail-area-comment__bar--title">
                <span>回执 ({{totalCount}})</span>
            </div>
            <div class="detail-area-comment__bar--right">
                <span class="iconfont"
                      :class="{'icon-shang': !showlist,'icon-you' : showlist}"
                      ></span>
            </div>
        </div>

        <div class="detail-area-comment__body" v-if="showlist">
            <task-comment-form v-if="allowComment"
                               :task-id="taskId"
                               @create-comment="createComment"></task-comment-form>
            <div class="detail-area-comment--list" v-show="list.length">
                <ul>
                    <li v-for="it in list">
                        <div class="detail-area-comment--list__wrapper">
                            <div class="via">
                              <task-avatar :avatar="it.simpleUser"></task-avatar>
                            </div>
                            <div class="content">
                                <div class="item-title">
                                    <label class="item-title__name">{{it.simpleUser.userName}}</label>
                                    <label class="item-title__time">{{it.createTime}}</label>
                                </div>
                                <div class="item-text">{{it.content}}</div>
                                <div class="item-file" v-for="file in it.attacheMents">
                                    <span class="item-file__type"><img :src="file.fileName|filetype"></span>
                                    <span class="item-file__name">{{file.fileName}}</span>
                                    <span class="size">({{file.fileSize|filesize}})</span>
                                    <span><a href="javascript:;" @click="downloadFile(file)">下载</a></span>
                                    <span><a href="javascript:;" v-if="userId == it.simpleUser.cn" @click="deleteFile(it,file)">删除</a></span>
                                    <span class="item-file__end" v-if="file.latest">END</span>
                                </div>
                            </div>
                            <div class="handle">
                                <a href="javascript:;" @click="showChildComment(it)"><span class="iconfont icon-xinxi"></span><span> ({{it.commentCount || 0}})</span></a>
                                <a href="javascript:;"
                                   v-if="userId == it.simpleUser.cn"
                                   @click="deleteComment(it)"><span class="iconfont icon-shanchu"></span></a>
                            </div>
                        </div>
                        <!--子评论 start-->
                        <div class="detail-area-comment--list__child"
                             v-if="it.isShowChild"
                             :class="{'detail-area-comment--list__view': !allowComment}"
                        >

                            <task-comment-form-Simple
                                    v-if="allowComment"
                                    :comment-item="it"
                                    @create-comment="createCommentChild">
                            </task-comment-form-Simple>

                            <div class="detail-area-comment--child__comment" v-show="it.childMessage && it.childMessage.length">
                                <ul>
                                    <li v-for="item in it.childMessage">
                                        <div class="detail-area-comment--list__wrapper">
                                            <div class="via">
                                                <task-avatar :avatar="item.user"></task-avatar>
                                            </div>
                                            <div class="content">
                                                <div class="item-title">
                                                    <label class="item-title__name">{{item.user.userName}}</label>
                                                    <label class="item-title__time">{{item.createTime}}</label>
                                                </div>
                                                <div class="item-text">{{item.content}}</div>
                                            </div>
                                            <div class="handle">
                                                <a href="javascript:;" @click="deleteCommentChild(it,item)"
                                                   v-if="userId == item.user.cn">
                                                    <span class="iconfont icon-shanchu"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="loading"
             v-show="loadingNext"
             loading-text="拼命加载中"
             v-loading="loadingNext">
        </div>
    </section>
</template>

<script>
    import taskCommentForm from './task-comment-form.vue';
    import taskCommentFormSimple from './task-comment-form-simple.vue';

    export default {
        name : 'taskComment',
        components : {
            'task-comment-form' : taskCommentForm,
            'task-comment-form-Simple' : taskCommentFormSimple
        },
        props : {
            /**任务ID*/
            taskId : {
                type    : [String,Number],
                default : null
            },
            /**是否允许回复*/
            allowComment : {
                type    : Boolean,
                default : true
            },
            //登录用户
            user : {}
        },
        data() {
            return {
                /**显示回执列表状态*/
                showlist : true,
                /**信息列表*/
                list : [],
                //回执页数
                pageCount : 0,
                pageNo : 1,
                totalCount : 0,
                loadingNext : false,
                /**用户ID*/
                userId : this.user.cn
            }
        },
        computed : {
            loadingNextComment () {
              return this.$store.state.loadingNextPageComment;
            }
        },
        watch : {
            taskId(){
                this.initData(this.taskId);
            },
            loadingNextComment(val){
                if(val && this.pageNo < this.pageCount){
                  this.pageNo += 1;
                  this.loadingNextPage();
                }
            }
        },
        created () {
            this.initData(this.taskId);
        },
        methods : {
            /**初始化回执列表*/
            async initData(){
                try {
                    let res           = await this.$api.getComment(this.taskId);
                    this.list         = res.data.pages.results;
                    this.totalCount   = res.data.pages.totalCount;
                    this.pageCount    = res.data.pages.pageCount;
                } catch (err){

                }
            },
            /**task-comment-form 组件的自定事件,回调*/
            createComment (item) {
                this.list.unshift(item);
                this.totalCount += 1;
            },
            /**task-comment-form-Simple 组件自定义事件，更新子评论列表
             * it: 评论项
             * item : api创建成功后返回的内容
             * */
            createCommentChild(it,item){
                it.childMessage.unshift(item);
                it.commentCount = it.childMessage.length;
            },
            //下载文件
            downloadFile (file){
                this.$api.downloadFile(file);
            },
            //删除文件
            async deleteFile (it,file){
                try{
                    await this.$confirm('确定删除该附件?');
                    let res = await this.$api.deleteComment({
                        fileId : file.fileUri,
                        responseId : it.id,
                        type : 0,
                        userId : this.user.cn
                    });
                    res.code === 200 && it.attacheMents.splice(it.attacheMents.indexOf(file),1);
                } catch (err){ }
            },
            //删除回执
            async deleteComment(it){
                try{
                    await this.$confirm('确认删除该条回执?')
                    let res = await this.$api.deleteComment({
                        fileId : '',
                        responseId : it.id,
                        type : 1,
                        userId : this.user.cn
                    });
                    res.code === 200 && this.list.splice(this.list.indexOf(it),1);
                } catch (err){ }

            },
            //显示子消息
            async showChildComment(it){
                let expendState = !it.isShowChild;
                this.list.forEach((item)=> this.$set(item,'isShowChild',false));
                it.isShowChild = expendState;
                //如果子评论数量为真，拉取服务器数据
                if(it.commentCount){
                    if(!it.hasOwnProperty('childMessage')){
                        let id  = it.id;
                        try{
                            let res = await this.$api.getCommentChild(id);
                            this.$set(it,'childMessage',res.data.result.results);
                        }catch (e){ }
                    }
                }else{
                    this.$set(it,'childMessage',[]);
                    //如果不允许评论，数量不为真的时候。不展开子评论列表区域
                    if(!this.allowComment){
                        it.isShowChild = false;
                    }
                }

            },

            //删除回执子列表
            async deleteCommentChild(it,item){
                try {
                    await this.$confirm('确认删除该条回执?');
                    await this.$api.deleteCommentChild(item.id);
                    it.childMessage.splice(it.childMessage.indexOf(item),1);
                } catch (e){ }

            },

            async loadingNextPage(){
              this.loadingNext = true;
              try {
                let res = await this.$api.getComment(this.taskId,this.pageNo);
                this.$store.commit('updateLoadingNextPageComment',false);
                let list  = res.data.pages.results;
                this.list = this.list.concat(list);
              } catch (err){

              }
              this.loadingNext    = false;
            }
        }
    }
</script>
