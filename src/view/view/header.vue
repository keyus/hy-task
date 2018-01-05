<template>
    <div class="task-card task-card-alone">
      <div class="task-card-top">
        <div class="task-card-top__title">
          <h5>任务：{{detail.task.name}}</h5>
        </div>
        <div class="task-card-top__time">
          <span class="text">始</span>
          <span class="time">{{detail.task.beginDate | formatDate}}</span>
        </div>
        <div class="task-card-top__time">
          <span class="text">终</span>
          <span class="time">{{detail.task.endDate | formatDate}}</span>
        </div>
        <div class="task-card-top__user" v-title title="负责人">
        <span class="img" v-avatar="detail.manager.sex"
              :head="detail.manager.head" ></span>
          <span class="user">{{detail.manager.userName}}</span>
        </div>
      </div>
      <div class="task-card-body">
        <p>描述： {{detail.task.description || '无'}}</p>
      </div>
      <div class="task-card-bottom">
        <div class="tag">
          <span class="from" v-title title="任务来源">
            <i class="iconfont icon-chakanxiangqing"></i> {{detail.task.type | from}}
          </span>

          <span class="who" v-if="detail.takeOverUser" v-title :title="detail.takeOverType | takeOver">
            <i class="iconfont icon-touxiang"></i> {{ detail.takeOverUser.userName }}
          </span>

        </div>

        <div class="rate">
        <span class="rate-bg">
          <span class="rate-highlight"
                :style="{width: detail.task.rate+'%'}"></span>
        </span>
          <span class="rate-num">{{detail.task.rate}}%</span>
        </div>

        <div class="grade">
          <span class="star">
            <span class="iconfont icon-xing1"
                  v-for="it in detail.task.urgency+1"></span>
          </span>
          <span class="text">{{detail.task.urgency | urgency}}</span>
        </div>

      </div>
  </div>
</template>

<script>
  export default {
    name :'viewHeader',
    props : {
      detail : {}
    },
    filters : {
      takeOver(val) {
        let text;
        if (val == 1) text = '指派人';
        if (val == 2) text = '领取人';
        return text;
      },
    }
  }
</script>
