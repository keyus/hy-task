<!--主区块包裹-->
<template>
  <div class="task-main-block">

    <div class="task-item task-source-manager">
      <div class="task-item-lb"><label>负责人</label></div>
      <div class="task-item-rb">
        <task-select-user type="one"
                          type-style='more'
                          :user="user"
                          :editable="editable.manager"
                          v-model="detail.manager"></task-select-user>
      </div>
    </div>

    <div class="task-item">
      <div class="task-item-lb"><label>结束时间</label></div>
      <div class="task-item-rb task-item-time" :class="{'not-select-time' : !editable.time}">
        <hy-date-picker
          size="140"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="detail.task.endDate"
          :clearable="false"
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
                          v-model="detail.members"></task-select-user>
      </div>
    </div>

    <task-desc v-model="detail.task.description"
               :editable="editable.description"
               placeholder="请添加任务源描述"></task-desc>



  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name : 'taskSourceMainBlock',
    props : {
      detail    : {},
      taskId    : {},
      editable  : {},
    },
    computed : {
      ...mapState({
        user : 'user'
      })
    },

  }
</script>
