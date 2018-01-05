<template>
  <div class="charts">
      <div class="charts-item">
        <div class="title">
          <label>完成情况</label>
          <label>总数：{{total.finish}}</label>
        </div>
        <div class="chart-box"  ref="finishChart" v-loading="loading"></div>
      </div>
      <div class="charts-space"></div>
      <div class="charts-item">
        <div class="title">
          <label>紧急程度</label>
          <label>总数：{{total.urgency}}</label>
        </div>
        <div class="chart-box"  ref="urgencyChart"  v-loading="loading"></div>
    </div>
  </div>
</template>


<script>
  import { mapState } from 'vuex'
  import echarts from 'echarts'
  import {finishOption,urgencyOption} from './charts'
  export default {
    name : 'taskChart',
    props : {
      selectChart : {},
    },
    data (){
      return {
        loading: true,
        chars : {},
      }
    },
    computed : {
      ...mapState({
        filter : 'taskCountFilter'
      }),
      total(){
        if(this.chars.hasOwnProperty('finishStatistics')){
          return {
            finish  : this.chars.finishStatistics.finished + this.chars.finishStatistics.notStart + this.chars.finishStatistics.onGoing + this.chars.finishStatistics.overdue,
            urgency : this.chars.importantStatistics.level1 + this.chars.importantStatistics.level2 + this.chars.importantStatistics.level3 + this.chars.importantStatistics.level4
          };
        }
        return {
          finish : 0,
          urgency : 0
        }

      }
    },
    watch : {
      selectChart(val){
        if(val){
          this.init();
          this.$emit('update:selectChart',false)
        }
      }
    },
    mounted(){
      this.init();
    },
    methods : {
      async init () {
        this.loading  = true;
        try{
          let res     = await this.$api.getCountCharts(this.filter);
          this.initCharts(res.data);
          this.chars  = res.data;
        }catch (e){}
        this.loading  = false;
      },
      initCharts(data) {
        let finish = echarts.init(this.$refs.finishChart);
        let urgency = echarts.init(this.$refs.urgencyChart);
        finish.setOption(finishOption(data.finishStatistics));
        urgency.setOption(urgencyOption(data.importantStatistics));
      },
    },

  }
</script>
