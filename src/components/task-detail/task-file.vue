<template>
    <div class="file-component" :class="{'not-upload' : disabled }">

        <span class="iconfont" :class="icon"></span>
        <span class="tip">最多支持{{max}}个附件，单个附件不超过{{size}}MB</span>
        <input type="file" @change="change" v-if="!disabled" />

        <!--文件列表-->
        <div class="filelist" v-show="files.length">
            <ul>
                <li v-for="it in files">
                    <span class="filetype">
                        <img :src="it.name|filetype">
                    </span>
                    <span class="title">{{it.name}}</span>
                    <span class="size">({{it.size|filesize}})</span>
                    <span class="cancle" v-if="it.loading"><a href="javascript:;" @click="cancle(it)">取消</a></span>
                    <span class="download" v-if="it.completed"><a href="javascript:;" @click="download(it)">下载</a></span>
                    <span class="delete" v-if="it.completed"><a href="javascript:;" @click="deleteFile(it)">删除</a></span>
                    <span class="end" v-if="it.latest">END</span>
                    <progress max="100" :value="it.value" v-if="it.loading"></progress>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
export default {
    name : 'taskFile',
    props : {
        disabled : {
            type : Boolean,
            default : false
        },
        //图标
        icon  : {
            default : 'icon-fujian'
        },
        //该组件v-model 双向绑定的值
        value : {
            type: Array,
            default : []
        },
        //最大上传数
        max  : {
            default : 5
        },
        //文件允许上传的大小MB
        size : {
            type : Number,
            default : 10
        },
        //是否是最终版本，该文件.标识
        isEnd : {
            default : 0
        },
        //已经存在的文件数据
        filesData : {
            default (){
                return [];
            }
        }
    },
    data() {
        return {
            files : this.filesData
        }
    },
    watch : {
        /**清空附件*/
        value (val) {
            if(!val.length) this.files = [];
        },
        isEnd () {
            this.files.forEach( it=> it.latest = this.latest);
            this.$emit('input',this.filesList);
        },
        /**更新已有数据*/
        filesData (val) {
            this.files = val;
        }
    },
    computed : {
        ...mapState({
          fileLoading : 'fileLoading'
        }),
        latest () {
            return this.isEnd ? 1 : 0;
        },
        fileSizeVal () {
            return 1024 * 1024 * this.size;
        },
        /**格式化文件列表*/
        filesList () {
            return this.files.map(it=>{
                return {
                    fileName : it.name,
                    fileSize : it.size,
                    fileUri : it.id,
                    latest : it.latest
                }
            });
        }
    },
    methods : {
        /**file控件改变*/
        change (el) {
            let file = el.target.files[0]; if(!file) return ;

            if (file.size > this.fileSizeVal) {
                this.$alert('文件大小不能超过' + this.size + "MB");
                return ;
            }

            if (this.files.length >= this.max ) {
                this.$alert('最多只能上传' + this.max + "个文件");
                return ;
            }
            //是否已存在上传文件列表中
            if(this.files.find(it=> it.name === file.name)) {
                this.$alert('不能上传相同名称的文件');
                el.target.value ='';
                return ;
            }
            let len  = this.files.push({
                file: file,          //文件对象
                name: file.name,     //文件名
                id: Math.random(),  //文件ID
                size: file.size,     //文件大小
                loading: true,      //上传状态
                value: 0,           //进度值
                completed : false,  //上传成功
                instence : null,    //上传实例
                latest : this.latest          //是否是最终版
            });
            this.$store.commit('updateFileLoading',true);
            this.upload(this.files[len-1]);
            el.target.value = '';   //清空file选择框
        },
        /**上传*/
        upload (item) {
            let vm = this;
            item.instence = this.$api.uploadFile({
                file : item,
                //进行中
                progress (e) {
                    item.value = e.loaded / e.total * 100;
                },
                //完成
                load (e) {
                    item.loading    = false;
                    item.completed  = true;
                    //上传完成后，会把文件ID，设置为文件服务器返回的真实ID，以供下载
                    item.id         = JSON.parse(e.currentTarget.responseText).data;
                    vm.$emit('input',vm.filesList);
                    vm.$store.commit('updateFileLoading',false);
                },
                //上传出错
                error () {
                    item.loading = false;
                    vm.files.splice(vm.files.indexOf(item),1);
                    vm.$store.commit('updateFileLoading',false);
                },
                //中断
                abort(){
                    vm.$store.commit('updateFileLoading',false);
                },
            })
        },
        /**取消*/
        cancle(item){
            item.instence.abort();
            this.files.splice(this.files.indexOf(item),1);
            this.$store.commit('updateFileLoading',false);
        },
        /**下载*/
        download(item){
            this.$api.downloadFile(item);
        },
        /**删除*/
        deleteFile(item){
            this.files.splice(this.files.indexOf(item),1);
            this.$emit('input',this.filesList)
        }
    },

}

</script>
