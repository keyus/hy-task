<template>
  <div class="task-filter-dialog"
       ref="filterDialog"
       v-if="visible"
       :style="style"
       >
    <div class="task-filter-dialog__arrow"></div>

    <!--任务中心-->
    <template v-if="isCenter">
      <div class="task-filter-dialog__item">
        <h5>状态</h5>
        <hy-checkbox-group v-model="center.status">
          <hy-checkbox label="1">未执行任务</hy-checkbox>
          <hy-checkbox label="2">已执行任务</hy-checkbox>
          <hy-checkbox label="3">已完成任务</hy-checkbox>
        </hy-checkbox-group>
      </div>
      <div class="task-filter-dialog__item">
        <h5>来源</h5>
        <hy-checkbox-group v-model="center.type">
          <hy-checkbox label="1">自建</hy-checkbox>
          <hy-checkbox label="2">邮件</hy-checkbox>
        </hy-checkbox-group>
      </div>
      <div class="task-filter-dialog__item  task-filter-dialog__date">
        <h5>创建日</h5>
        <div class="filter-date">
          <label class="text">从</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="center.createBegin"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
          <label class="text">至</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="center.createEnd"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
        </div>
      </div>
      <div class="task-filter-dialog__item task-filter-dialog__date">
        <h5>结束日</h5>
        <div class="filter-date">
          <label class="text">从</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="center.endDate1"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
          <label class="text">至</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="center.endDate2"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
        </div>
      </div>
    </template>

    <!--我的任务-->
    <template v-else>
      <div class="task-filter-dialog__item">
        <h5>状态</h5>
        <hy-checkbox-group v-model="mytask.completion">
          <hy-checkbox :label="0">未完成的任务</hy-checkbox>
          <hy-checkbox :label="1">完成的任务</hy-checkbox>
        </hy-checkbox-group>
      </div>
      <div  class="task-filter-dialog__item">
        <h5>类别</h5>
        <hy-checkbox-group v-model="mytask.status">
          <hy-checkbox :label="1">参与的任务</hy-checkbox>
          <hy-checkbox :label="2">关注的任务</hy-checkbox>
          <hy-checkbox :label="3">负责的任务</hy-checkbox>
          <hy-checkbox :label="4">创建的任务</hy-checkbox>
        </hy-checkbox-group>
      </div>
      <div class="task-filter-dialog__item  task-filter-dialog__date">
        <h5>创建日</h5>
        <div class="filter-date">
          <label class="text">从</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="mytask.sCreateTime"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
          <label class="text">至</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="mytask.eCreateTime"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
        </div>
      </div>
      <div class="task-filter-dialog__item task-filter-dialog__date">
        <h5>结束日</h5>
        <div class="filter-date">
          <label class="text">从</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="mytask.sEndTime"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
          <label class="text">至</label>
          <div>
            <hy-date-picker
              size="140"
              :value-format="dateFormat"
              v-model="mytask.eEndTime"
              :clearable="clearable"
              type="date"
              :editable="editable"
              popper-class="hy-data-picker-blue"
              :placeholder="placeholder">
            </hy-date-picker>
          </div>
        </div>
      </div>
    </template>

    <div class="task-filter-dialog__btn">
      <button @click="reset">重置</button>
      <button @click="enter">确定</button>
    </div>
  </div>
</template>

<script>
  import {nowDate,oneYearAgo} from '../../../store/index'

  export default {
    data(){
      return {
        visible   : false,
        placeholder : '年/月/日',
        style     : '',
        //传入的filter
        filter : {},

        //我的任务状态
        mytask  : {
          completion : ['0','1'],
          status  : ['1','2','3','4'],
          sCreateTime : '',
          eCreateTime : '',
          sEndTime    : '',
          eEndTime    : '',
        },
        //任务中心过滤器状态
        center  : {
          status  : ['1','2','3'],
          type    : ['1','2'],
          createBegin : '',
          createEnd : '',
          endDate1    : '',
          endDate2    : '',
        },

        //是否是任务中心发起的dialog
        isCenter  : false,

        //是否允许编辑时间控件
        editable  : false,
        //是否显示时间控件的除扫按钮
        clearable : false,
        dateFormat: 'yyyy-MM-dd',
      }
    },
    watch : {
      //显隐
      visible(val){
        if(val){
          this.$nextTick(()=>{
            document.addEventListener('click',this.otherClickHide)
          })
        }else{
          this.$nextTick(()=>{
            document.removeEventListener('click',this.otherClickHide)
          })
        }
      },
      //传入的filter格式转换
      filter : {
        immediate :true,
        handler (val) {
          if(typeof val === 'object'){
            this.initFilter();
          }
        }
      },

      //监控时间选择-我的任务
      'mytask.sCreateTime' (val,oldval) {
        let oneyear = moment(this.mytask.eCreateTime).subtract(1, 'years');

        if(!this.compareDate(val,this.mytask.eCreateTime,'<')){
          this.$alert('开始日不能大于结束日');
          this.mytask.sCreateTime = oldval;
          return ;
        }
        if(moment(val).isBefore(oneyear)){
          this.$alert('筛选的时间间隔不得大于1年');
          this.mytask.sCreateTime = oldval;
        }
      },
      'mytask.eCreateTime' (val,oldval) {
        let oneyear = moment(this.mytask.sCreateTime).add(1, 'years');
        if(!this.compareDate(val,this.mytask.sCreateTime)){
          this.$alert('结束日期必须大于开始日期');
          this.mytask.eCreateTime = oldval;
          return ;
        }
        if(moment(val).isAfter(oneyear)){
          this.$alert('筛选的时间间隔不得大于1年');
          this.mytask.eCreateTime = oldval;
        }
      },
      'mytask.sEndTime' (val,oldval) {
        if(this.mytask.eEndTime && val){
          let oneyear = moment(this.mytask.eEndTime).subtract(1, 'years');
          if(!this.compareDate(val,this.mytask.eEndTime,'<')){
            this.$alert('开始日不能大于结束日');
            this.mytask.sEndTime = oldval;
            return ;
          }
          if(moment(val).isBefore(oneyear)){
            this.$alert('筛选的时间间隔不得大于1年');
            this.mytask.sEndTime = oldval;
          }
        }
      },
      'mytask.eEndTime' (val,oldval) {
        if(this.mytask.sEndTime && val){
          let oneyear = moment(this.mytask.sEndTime).add(1, 'years');
          if(!this.compareDate(val,this.mytask.sEndTime)){
            this.$alert('结束日期必须大于开始日期');
            this.mytask.eEndTime = oldval;
            return ;
          }
          if(moment(val).isAfter(oneyear)){
            this.$alert('筛选的时间间隔不得大于1年');
            this.mytask.eEndTime = oldval;
          }
        }
      },

      //监控时间选择-任务中心
      'center.createBegin' (val,oldval) {
        let oneyear = moment(this.center.createEnd).subtract(1, 'years');
        if(!this.compareDate(val,this.center.createEnd,'<')){
          this.$alert('开始日不能大于结束日');
          this.center.createBegin = oldval;
          return ;
        }
        if(moment(val).isBefore(oneyear)){
          this.$alert('筛选的时间间隔不得大于1年');
          this.center.createBegin = oldval;
        }
      },
      'center.createEnd' (val,oldval) {
        let oneyear = moment(this.center.createBegin).add(1, 'years');
        if(!this.compareDate(val,this.center.createBegin)){
          this.$alert('结束日期必须大于开始日期');
          this.center.createEnd = oldval;
          return ;
        }
        if(moment(val).isAfter(oneyear)){
          this.$alert('筛选的时间间隔不得大于1年');
          this.center.createEnd = oldval;
        }
      },
      'center.endDate1' (val,oldval) {
        if(this.center.endDate2 && val){
          let oneyear = moment(this.center.endDate2).subtract(1, 'years');
          if(!this.compareDate(val,this.center.endDate2,'<')){
            this.$alert('开始日不能大于结束日');
            this.center.endDate1 = oldval;
            return ;
          }
          if(moment(val).isBefore(oneyear)){
            this.$alert('筛选的时间间隔不得大于1年');
            this.center.endDate1 = oldval;
          }
        }
      },
      'center.endDate2' (val,oldval) {
        if(this.center.endDate1 && val){
          let oneyear = moment(this.center.endDate1).add(1, 'years');
          if(!this.compareDate(val,this.center.endDate1)){
            this.$alert('结束日期必须大于开始日期');
            this.center.endDate2 = oldval;
            return ;
          }
          if(moment(val).isAfter(oneyear)){
            this.$alert('筛选的时间间隔不得大于1年');
            this.center.endDate2 = oldval;
          }
        }
      },
    },
    methods : {
      //点击空白区域关闭弹窗
      otherClickHide(e){
        let target = e.target;
        let picker = document.querySelectorAll('.hy-data-picker-blue');
        let dialog = document.querySelectorAll('.dialog-fix');
        let isInPicker = false;
        let isInDialog = false;
        if(picker && picker.length){
          Array.prototype.forEach.call(picker,(it)=>{
            if(it.contains(target)){
              isInPicker = true;
            }
          })
        }
        if(dialog && dialog.length){
          Array.prototype.forEach.call(dialog,(it)=>{
            if(it.contains(target)){
              isInDialog = true;
            }
          })
        }
        if(!this.$refs.filterDialog.contains(target) && !isInPicker && !isInDialog){
          this.$emit('close');
        }
      },

      //初始化filter,蛋疼的API,到处的API。数据格式都不统一
      initFilter (){
        if(this.isCenter) {
          this.filter.status = this.filter.status.split(',');
          this.filter.type = this.filter.type.split(',');
          Object.keys(this.center).forEach(key=>{
            this.center[key] = this.filter[key];
          })
        }else{
          let arr = [];
          //根据API格式，处理成checkbox array group数组格式
          this.filter.completion ? arr.push(Number(this.filter.completion)) :(arr = [0,1]);
          this.filter.completion = arr;
          Object.keys(this.mytask).forEach(key=>{
            this.mytask[key] = this.filter[key];
          })
        }
      },

      //比较时间大小
      compareDate(date1,date2,str='>'){
        if(str === '>'){
          return moment(date1).isAfter(date2) || moment(date1).isSame(date2);
        }
        if(str === '<'){
          return moment(date1).isBefore(date2)  || moment(date1).isSame(date2);
        }
      },

      //确定
      enter(){
        let filter;
        //把当前组件内的状态数据，返回
        if(this.isCenter) {
          filter          = Object.assign({},this.center);
          filter.status   = filter.status.join(',');
          filter.type     = filter.type.join(',');
        }else{
          filter = Object.assign({},this.mytask);
          if(filter.completion.length === 2){
            filter.completion = '';
          }else{
            filter.completion = filter.completion.join(',');
          }
        }
        this.$emit('enter',filter);
      },

      //重置
      reset(){
        if(this.isCenter){
          //任务中心
          this.center.type  = ['1','2'];
          this.center.status      = ['1','2','3'];
          this.center.createBegin = oneYearAgo;
          this.center.createEnd   = nowDate;
          this.center.endDate1    =   '';
          this.center.endDate2    =   '';

        }else {
          //我的任务
          this.mytask.type        = [1,2];
          this.mytask.status      = [1,2,3,4];
          this.mytask.sCreateTime = oneYearAgo;
          this.mytask.eCreateTime = nowDate;
          this.mytask.sEndTime    =   '';
          this.mytask.eEndTime    =   '';
        }

      }
    }
  }
</script>
