<template>
  <div class="task-count-filter" ref="taskCountFilter">
    <div class="task-count-filter-bar">
      <div class="create-date">
        <span class="create-date__text">创建日</span>
        <span>
          <hy-date-picker size="140"
                          popper-class="hy-data-picker-blue"
                          type="date"
                          v-model="sCreateTime"
                          :value-format="dateFormat"
                          :editable="editable"
                          :clearable="clearable"
                          placeholder="选择日期">
          </hy-date-picker>
        </span>
      </div>
      <div class="create-date">
        <span class="create-date__text">至</span>
        <span>
          <hy-date-picker
            size="140"
            :value-format="dateFormat"
            v-model="eCreateTime"
            :clearable="clearable"
            type="date"
            :editable="editable"
            popper-class="hy-data-picker-blue"
            placeholder="选择日期">
          </hy-date-picker>
        </span>
      </div>

      <div class="handle">
        <button class="reset" @click="reset">重置</button>
        <button @click="select">查询</button>
        <span class="iconfont"
              :class="{ 'icon-shang1' : extend , 'icon-right-O' : !extend }"
              @click="toggle"></span>
      </div>
    </div>

    <div class="task-count-filter-pop" v-show="extend">
      <div class="task-count-filter-bar">
        <div class="create-date">
          <span class="create-date__text">结束日</span>
          <span>
          <hy-date-picker
            size="140"
            :value-format="dateFormat"
            v-model="sEndTime"
            :clearable="clearable"
            type="date"
            :editable="editable"
            popper-class="hy-data-picker-blue"
            placeholder="年/月/日">
          </hy-date-picker>
        </span>
        </div>
        <div class="create-date">
          <span class="create-date__text">至</span>
          <span>
          <hy-date-picker
            size="140"
            :value-format="dateFormat"
            v-model="eEndTime"
            :clearable="clearable"
            type="date"
            :editable="editable"
            popper-class="hy-data-picker-blue"
            placeholder="年/月/日">
          </hy-date-picker>
        </span>
        </div>
      </div>

      <h5>类别</h5>

      <hy-checkbox-group v-model="status">
        <hy-checkbox :label="it.value" v-for="it in statusList" :key="it.value">{{it.text}}</hy-checkbox>
      </hy-checkbox-group>
    </div>

  </div>
</template>

<script>
  export default {
    name : 'taskCountFilter',
    props : {
      selectList : {},
      selectChart : {},
    },
    data (){
      return {
        //禁止编辑
        editable  : false,
        clearable : false,

        dateFormat : 'yyyy-MM-dd',
        extend : false,

        sCreateTime : this.$store.state.oneYearAgo,
        eCreateTime : this.$store.state.nowDate,
        sEndTime    : '',
        eEndTime    : '',

        statusList: [
          { text: "参与的任务", value: 1 },
          { text: "关注的任务", value: 2 },
          { text: "负责的任务", value: 3 },
          { text: "创建的任务", value: 4 },
        ],
        status: [1,2,3,4],
      }
    },

    watch : {
      //创建日，起
      sCreateTime(val,oldval){
        let oneyear = moment(this.eCreateTime).subtract(1, 'years');

        if(!this.compareDate(val,this.eCreateTime,'<')){
          this.$alert('开始日不能大于结束日');
          this.sCreateTime = oldval;
          return ;
        }

        if(moment(val).isBefore(oneyear)){
          this.$alert('筛选的时间间隔不得大于1年');
          this.sCreateTime = oldval;
        }

      },
      //创建日，终
      eCreateTime(val,oldval){
        let oneyear = moment(this.sCreateTime).add(1, 'years');
        if(!this.compareDate(val,this.sCreateTime)){
          this.$alert('结束日期必须大于开始日期');
          this.eCreateTime = oldval;
          return ;
        }
        if(moment(val).isAfter(oneyear)){
          this.$alert('筛选的时间间隔不得大于1年');
          this.eCreateTime = oldval;
        }
      },

      //终止日，起
      sEndTime(val,oldval){
        if(this.eEndTime && val){
          let oneyear = moment(this.eEndTime).subtract(1, 'years');
          if(!this.compareDate(val,this.eEndTime,'<')){
            this.$alert('开始日不能大于结束日');
            this.sEndTime = oldval;
            return ;
          }
          if(moment(val).isBefore(oneyear)){
            this.$alert('筛选的时间间隔不得大于1年');
            this.sEndTime = oldval;
          }
        }
      },
      //终止日，终
      eEndTime(val,oldval){
        if(this.sEndTime && val){
          let oneyear = moment(this.sEndTime).add(1, 'years');
          if(!this.compareDate(val,this.sEndTime)){
            this.$alert('结束日期必须大于开始日期');
            this.eEndTime = oldval;
            return ;
          }
          if(moment(val).isAfter(oneyear)){
            this.$alert('筛选的时间间隔不得大于1年');
            this.eEndTime = oldval;
          }
        }

      },

      extend (val){
        if(val){
          this.$nextTick(()=>{
            document.addEventListener('click',this.otherClickHide);
          })
        }else{
          document.removeEventListener('click',this.otherClickHide);
        }
      }
    },

    methods : {
      //比较时间大小
      compareDate(date1,date2,str='>'){
        if(str === '>'){
          return moment(date1).isAfter(date2) || moment(date1).isSame(date2);
        }
        if(str === '<'){
          return moment(date1).isBefore(date2)  || moment(date1).isSame(date2);
        }
      },
      //点击其它区域
      otherClickHide(e){
        let target = e.target;
        let dialog = document.querySelector('.dialog-fix');
        if(!this.$refs.taskCountFilter.contains(target)) {
          if(dialog && dialog.contains(target)){
            return ;
          }
          this.extend = false;
        }
      },
      //重置
      reset(){
        this.status           = [1,2,3,4];
        this.sCreateTime    = this.$store.state.oneYearAgo;
        this.eCreateTime    = this.$store.state.nowDate;
        this.sEndTime       = '';
        this.eEndTime       = '';
      },
      //查询
      select(){
        this.$store.commit({ type : 'updateFilter', data : {
          sCreateTime : this.sCreateTime,
          eCreateTime : this.eCreateTime,
          sEndTime    : this.sEndTime,
          eEndTime    : this.eEndTime,
          pageNo      : 1,
          status      : this.status
        },  name : 'taskCountFilter' });
        this.extend = false;
        this.$emit('update:selectList',true);
        this.$emit('update:selectChart',true);
      },
      toggle(){
        this.extend = !this.extend;
      },

    }

  }
</script>
