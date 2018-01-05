<template>
  <div class="mytask">
    <task-header></task-header>
    <task-count-filter :select-chart.sync="selectChart" :select-list.sync="selectList"></task-count-filter>
    <section class="section-count">
      <task-chart :select-chart.sync="selectChart"></task-chart>
      <task-count-list :select-list.sync="selectList"></task-count-list>
    </section>
  </div>
</template>

<script>
  import taskCountFilter from './task-count-filter.vue'
  import taskChart from './task-chart.vue'
  import taskCountList from './task-count-list.vue'

  export default {
    components : {
      taskCountFilter,
      taskChart,
      taskCountList,
    },
    data (){
      return {
        //是否执行搜索
        selectList : false,
        selectChart : false,
      }
    }
  }
</script>
