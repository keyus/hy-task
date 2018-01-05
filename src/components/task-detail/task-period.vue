<!--周期创建 -->
<template>
  <div class="task-item">
    <div class="task-item-lb"><label>周期</label></div>
    <div class="task-item-rb">
      <div class="detail-main-item__cycle">
        {{currentValue.description}} <a href="javascript:;" v-if="editable" @click="select">更多</a>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
        name : 'taskPeriod',
        props : {
          //没用到
            disabled : {
                type : Boolean,
                default : false
            },
            //双向绑定值-返回给父组件
            value : {
                type : Object,
                default (){
                    return {}
                }
            },
            editable : {
              type : Boolean,
              default : true
            },
            //周期数据
            taskPeriod : {},
        },
        watch : {
            taskPeriod : {
              immediate : true,
              handler (val){
                this.currentValue = val;
                if(val){
                  this.$store.commit('updatePeriodModel',val);
                }
              }
            },
            currentValue : {
                immediate : true,
                handler (val){
                    if(!val){
                        this.currentValue = {
                            description     : '',       // 周期循环创建结果 ,
                             period         : 0,       // 类型 0-永不 1-按天 2-按周 3-按月 , ,
                             periodValue    : '',       // 循环创建值 按周或按月时值为星期值(1~7)/每月第几天(1~31) ,
                             stoped         : '',       // 停止 0-永不 1-次数 2-日期 ,
                             stopedValue    : '',       //循环停止取值 0-永不 1-次数 2-日期 ,
                             taskId         : '',       //任务id
                        };
                        return ;
                    }
                    this.currentValue = val;
                }
            }
        },
        data() {
            return {
                currentValue : this.taskPeriod
            }
        },
        methods : {
            async select (){
                try{
                    let res = await this.$taskPeriod({
                        options : this.currentValue
                    });
                    this.currentValue.description = res.desc ;
                    if(!res.data){
                        this.currentValue.period = 0;
                    }else{
                        //res.data为父组件想要的数据模型结构
                        res.data && this.$emit('input',res.data);

                        Object.keys(res.data).forEach(key=>{
                            this.currentValue[key] = res.data[key];
                        });

                    }

                } catch (e){ };
            }
        }
    }

</script>
