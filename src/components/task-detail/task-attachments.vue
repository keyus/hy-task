<template>
    <div class="task-item task-item-attach">
        <div class="task-item-lb"><label>附件</label></div>
        <div class="task-item-rb">
            <div class="task-item-attach__file">
                <file v-model="files"
                      :disabled="!editable"
                      :files-data="filesData"
                      icon="icon-tianjia"></file>
            </div>
        </div>
    </div>
</template>
<script>
    import file from './task-file.vue'

    export default {
        name : 'taskAttachments',
        components : {
            file
        },
        props : {
            //任务ID
            taskId: {},
            //v-model文件数据映射到父级
            value : {},
            //状态：新建任务源
            isNew  : {},
            editable : {
                type : Boolean,
                default : true
            },
        },
        data() {
            return {
                files : [],
                filesData : []
            }
        },
        computed : {
            //数据模型，参数update-detail更新接口
            filesValue () {
                if(!this.filesData) return [];
                return this.filesData.map(it=>{
                    return {
                        fileName: it.name,
                        fileSize: it.size,
                        fileUri: it.id,
                        latest: 0
                    }
                })
            }
        },
        /**在watch中会把数据的变化更新到父组件的files中,也就是props传过来的值*/
        watch : {
            filesValue (val) {
                this.$emit('input',val);
            },
            files (val){
                this.$emit('input',val);
            }
        },
        created (){
            this.init();
        },
        methods : {
            async init (){
              if(this.isNew) return ;
                try{
                    let res = await this.$api.getAttachments(this.taskId);
                    this.filesData = this.convert(res.data.pages.results);
                } catch (e){
                    console.error('获取任务附件失败');
                }
            },
            //转换成file组件中可以显示的数据
            convert (obj) {
                if(!obj.length) return ;
                return obj.map(it=>{
                    return {
                        file: '',                     //文件对象
                        name: it.fileName,                //文件名
                        id: it.fileId,              //文件ID
                        size: it.fileSize,                //文件大小
                        loading: false,                  //上传状态
                        value: 0,                       //进度值
                        completed : true,              //上传成功
                        instence : null,                //上传实例
                        latest : it.latest          //是否是最终版
                    }
                })

            }
        }


    }
</script>
