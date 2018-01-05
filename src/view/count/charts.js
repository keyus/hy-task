export const finishOption = (data)=>{
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top: "4%",
      left: '6%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    yAxis:
      {
        type: 'category',
        data: ['未开始', '进行中', '逾期', '完成'],
        axisTick: {
          alignWithLabel: true
        }
      },
    xAxis: [
      {
        type: 'value',
        boundaryGap: true
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: function(param) {
              return ["#60b6ec", "#42ae42", "#f46265", "#9e9e9e"][param.dataIndex]
            }
          }
        },
        data: [
          data.notStart,
          data.onGoing,
          data.overdue,
          data.finished
        ]
      }
    ]
  };
}
export const urgencyOption = (data)=>{
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top: "4%",
      left: '6%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    yAxis: [
      {
        type: 'category',
        data: ['不重要不紧急', '重要不紧急', '不重要紧急', '重要紧急'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    xAxis: [
      {
        type: 'value',
        boundaryGap: true
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: function(param) {
              return ["#f2da3a", "#f5ac38", "#f37d4d", "#eb4a2a"][param.dataIndex]
            }
          }
        },
        data: [
          data.level1,
          data.level2,
          data.level3,
          data.level4
        ]
      }
    ]
  };
}
