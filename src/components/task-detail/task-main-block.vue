<!--主区块包裹-->
<template>
  <div class="task-main-block">

    <div class="task-item">
      <div class="task-item-lb"><label>负责人</label></div>
      <div class="task-item-rb">
        <task-select-user type="one"
                          :excludeUser="concernsIds"
                          excludeTip ="选择结果不能含有关注人"
                          :editable="editable.manager"
                          :user="user"
                          v-model="detail.manager"></task-select-user>
      </div>
    </div>

    <div class="task-item">
      <div class="task-item-lb"><label>结束时间</label></div>
      <div class="task-item-rb task-item-time" :class="{'not-select-time' : !editable.time}">
        <hy-date-picker
          size="140"
          value-format="yyyy-MM-dd"
          v-model="detail.task.endDate"
          :clearable="false"
          type="date"
          :disabled="!editable.time"
          :editable="false"
          popper-class="hy-data-picker-blue">
        </hy-date-picker>

        <div class="urgency">
          <label>紧急程度：</label>
          <template v-if="editable.urgency">
            <select v-model="detail.task.urgency">
                <option value="3">重要紧急</option>
                <option value="2">重要不紧急</option>
                <option value="1">不重要紧急</option>
                <option value="0">不重要不紧急</option>
            </select>
          </template>
          <template v-else>
            {{detail.task.urgency | urgency}}
          </template>
        </div>
      </div>
    </div>

    <div class="task-item task-item-member">
      <div class="task-item-lb"><label>参于人</label></div>
      <div class="task-item-rb">
        <task-select-user :user="user"
                          :editable="editable.members"
                          :excludeUser="concernsIds"
                          excludeTip ="选择结果不能含有关注人"
                          v-model="detail.members"></task-select-user>
      </div>
    </div>

    <task-rate :task-id = "taskId"
               :editable="editable.rate"
               :value.sync="detail.task.rate"
               :desc.sync="detail.task.rateDesc"></task-rate>

    <task-desc v-model="detail.task.description"
               :editable="editable.description"
               placeholder="请添加任务描述"></task-desc>

    <div class="task-item" v-if="detail.parentTaskName">
      <div class="task-item-lb"><label>上级任务</label></div>
      <div class="task-item-rb">
        {{detail.parentTaskName}}
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name : 'taskMainBlock',
    props : {
      detail    : {},
      taskId    : {},
      editable  : {},
    },
    computed : {
      ...mapState({
        user : 'user'
      }),
      //关注人ID
      concernsIds(){
        let res = [];
        this.detail.concerns.forEach(it=> res.push(it.cn));
        return res;
      }
    },
  }
</script>
