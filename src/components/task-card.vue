<!--任务卡片-->


<template>
  <div class="task-card"
       @click="open()"
       :class="item.status | taskType"
       v-if="!isDelete">

    <!--未开始-->
    <template v-if="isSource">
      <div class="task-card-top">
        <div class="task-card-top__title">
          <h5>任务：{{item.name || item.taskName}}</h5>
        </div>
      </div>
      <div class="task-card-body">
        <p  v-title :title="item.description">描述： {{item.description || '无'}}</p>
      </div>
      <div class="task-card-bottom">
        <div class="tag">
          <span class="from">
            <i class="iconfont icon-chakanxiangqing"></i> {{item.type | from}}
          </span>
        </div>

        <div class="task-card-handle">
          <button @click.stop="open('dispatch')">指派</button>
          <button @click.stop="open('get')">领取</button>
        </div>
      </div>
    </template>

    <!--已开始-->
    <template v-else>
      <div class="task-card-top">
        <div class="task-card-top__title">
          <h5>任务：{{item.taskName || item.name}}</h5>
          <span v-if="item.hasEvent">动态</span>
        </div>
        <div class="task-card-top__time">
          <span class="text">始</span>
          <span class="time">{{item.startDate || item.beginDate}}</span>
        </div>
        <div class="task-card-top__time">
          <span class="text">终</span>
          <span class="time">{{item.endDate}}</span>
        </div>
        <div class="task-card-top__user" v-title title="负责人">
        <span class="img" v-avatar="item.manager.sex"
              :head="item.manager.head" ></span>
          <span class="user">{{item.manager.userName}}</span>
        </div>
      </div>
      <div class="task-card-body">
        <p  v-title :title="item.description">描述： {{item.description || '无'}}</p>
      </div>
      <div class="task-card-bottom">
        <div class="tag">
          <span class="from" v-title title="任务来源">
            <i class="iconfont icon-chakanxiangqing"></i> {{item.type | from}}
          </span>

          <span class="who" v-if="item.takeOverUser" v-title :title="item.takeOverType | takeOver">
            <i class="iconfont icon-touxiang"></i> {{ item.takeOverUser.userName }}
          </span>

          <router-link :to="{ path: 'view', query: { taskId: item.taskId }}" @click.native.stop>
            <i class="iconfont icon-chakanfuzhi"></i> 查看动态
          </router-link>

        </div>

        <div class="rate">
        <span class="rate-bg">
          <span class="rate-highlight"
                :style="{width: item.rate+'%'}"></span>
        </span>
          <span class="rate-num">{{item.rate}}%</span>
        </div>

        <div class="grade">
          <span class="star">
            <span class="iconfont icon-xing1"
                  v-for="it in item.urgency+1"></span>
          </span>
          <span class="text">{{item.urgency | urgency}}</span>
        </div>

      </div>
    </template>

  </div>
</template>

<script>
  export default {
    name: 'taskCard',
    props : {
      item : {
        type : Object,
        default (){
          return {}
        }
      }
    },
    data () {
      return {
        //确认移除自身
        isDelete : false
      }
    },
    computed : {
      //是否是任务中心任务源样式-未开始任务
      isSource() {
        return this.item.status == 1;
      }
    },
    methods : {
      async open(type){
        let res ;
        let options = {
          taskId : this.item.taskId || this.item.id
        };
        try{
          //打开任务源
          if(this.isSource){
            options.type = type;
            res = await this.$taskSourceDialog(options);
            res === 'reload' ? this.$emit('reload') : this.updateSource(res);
          }
          //打开任务详情
          else{
            if(!this.item.viewPermission) {
              this.$alert('无权查看任务详情');
              return ;
            }
            res = await this.$taskDialog(options);
            this.updateItem(res);
          }
        } catch (e){
          //删除自身
          if(e === 'delete'){
            this.isDelete = true;
          }
          //完结
          if(e === 'finished'){
            this.item.status = 3;
          }
        }

      },
      //update task item
      updateItem(data){
        this.item.hasOwnProperty('taskName') && (this.item.taskName = data.task.name);
        this.item.hasOwnProperty('name') && (this.item.name = data.task.name);
        this.item.description  = data.task.description;
        this.item.rate         = data.task.rate;
        this.item.urgency      = data.task.urgency;
        this.item.startDate    = moment(data.task.beginDate).format('YYYY-MM-DD');
        this.item.endDate      = moment(data.task.endDate).format('YYYY-MM-DD');
        this.item.manager      = Object.assign({},data.manager);
      },
      //update source item
      updateSource (data){
        this.item.hasOwnProperty('taskName') && (this.item.taskName = data.task.name);
        this.item.hasOwnProperty('name') && (this.item.name = data.task.name);
        this.item.description  = data.task.description;
      }
    },
    filters : {
      takeOver(val){
        let text;
        if(val == 1 ) text = '指派人';
        if(val == 2 ) text = '领取人';
        return text;
      },
      //任务类型
      taskType (val){
        let className ;
        switch (val){
          case 1 :
            className = 'task-card-source';
            break;
          case 3 :
            className = 'task-card-finish';
            break;
          case 4 :
            className = 'task-card-overdue';
            break;
          default :
            className = '';
            break
        }
        return className;
      }
    }
  }
</script>
