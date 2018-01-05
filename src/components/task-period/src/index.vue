<template>
    <div class="dialog-period" v-if="visible">
        <div class="mask">
            <div class="dialog-period-wrapper">
                <div class="dialog-period-head">
                    <div class="dialog-period-head__left">
                        <span class="logo-icon"></span>
                        <span>周期规则设置</span>
                    </div>
                    <a href="javascript:;" class="close iconfont icon--close" @click="close"></a>
                </div>
                <div class="dialog-period-main">
                    <div class="dialog-period-form">
                        <div class="dialog-period-form__group">
                            <div class="dialog-period-form__group-item">
                                <label>循　环：</label>
                                <select v-model="period">
                                    <option value="0">不循环</option>
                                    <option value="1">按天</option>
                                    <option value="2">按周</option>
                                    <option value="3">按月</option>
                                </select>
                            </div>
                            <div v-show="period == 2">
                                <label>每周</label>
                                <select v-model="periodWeek" class="week">
                                    <option value="1">星期一</option>
                                    <option value="2">星期二</option>
                                    <option value="3">星期三</option>
                                    <option value="4">星期四</option>
                                    <option value="5">星期五</option>
                                    <option value="6">星期六</option>
                                    <option value="7">星期日</option>
                                </select>
                            </div>
                            <div v-show="period == 3">
                                <label>每月第</label>
                                <span><input type="text" v-model="periodMoth" placeholder="1" @blur="periodBlur($event)"> 天</span>
                            </div>
                        </div>
                        <div class="dialog-period-form__group" v-show="period != 0">
                            <div class="dialog-period-form__group-item">
                                <label>停　止：</label>
                                <select v-model="stoped">
                                    <option value="0">永不</option>
                                    <option value="1">次数</option>
                                    <option value="2">日期</option>
                                </select>
                            </div>
                            <div v-show="stoped == 1">
                                <label>循环</label>
                                <span><input type="text"
                                             v-model="stopedNum"
                                             placeholder="1"
                                             @blur="stopedBlur($event)" > 次</span>
                            </div>
                            <div v-show="stoped == 2">
                                <hy-date-picker
                                  size="140"
                                  value-format="yyyy-MM-dd"
                                  v-model="stopedDate"
                                  :clearable="false"
                                  type="date"
                                  :editable="false"
                                  popper-class="hy-data-picker-blue">
                                </hy-date-picker>
                            </div>
                        </div>

                        <div class="dialog-period-form__group" v-show="period != 0">
                            <label class="res">结　果： </label>
                            <span>{{desc}}</span>
                        </div>
                    </div>
                    <div class="dialog-period-handle">
                        <a href="javascript:;" @click="enter">确定</a>
                        <a href="javascript:;" @click="close">取消</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible : false,
                //由options传入覆盖
                options : {
                    period  : 0,               // 类型 0-永不 1-按天 2-按周 3-按月 ,
                    periodValue   : '',         // 循环创建值 按周或按月时值为星期值(1~7)/每月第几天(1~31) ,
                    stoped    : 0,              // 停止 0-永不 1-次数 2-日期 ,
                    stopedValue     : '',       //循环停止取值 0-永不 1-次数 2-日期 ,
                },

                period : 0,
                periodWeek : 1,
                periodMoth : 1,
                stoped : 0,
                stopedNum : 1,
                stopedDate : moment().format('YYYY-MM-DD'),

            }
        },
        created (){
            this.setValue(this.options);
        },
        watch : {
            options (data){
                console.log("运行:currentRule",data);
                if(data && typeof data === 'object'){
                    this.setValue(data);
                }
            },
            periodMoth(val,oldval) {
                if(val == ''){
                    return ;
                }
                if(!/^(0?[1-9]$)|^([1-2][0-9]$)|^(3[0-1]$)/g.test(val)){
                    this.periodMoth = oldval;
                }
            },
            stopedNum (val,oldval){
                if(!val){
                    return ;
                }
                if(!/^[1-9]([0-9]|00)?$/g.test(val)){
                    this.stopedNum = oldval;
                }
            }
        },
        computed : {
            //计算描述结果
            desc (){
                if(this.period == 0)  return '不循环';
                if(this.period == 1)  {
                    if(this.stoped == 0 )  return '每天执行';
                    if(this.stoped == 1 )  return `每天执行 循环${this.stopedNum || 1}次`;
                    if(this.stoped == 2 )  return `每天执行 ${this.stopedDate}停止`;
                }
                if(this.period == 2)  {
                    let week = this.weekDay(this.periodWeek);
                    if(this.stoped == 0 )  return `每周${week}执行`;
                    if(this.stoped == 1 )  return `每周${week}执行 循环${this.stopedNum || 1}次`;
                    if(this.stoped == 2 )  return `每周${week}执行 ${this.stopedDate}停止`;
                }
                if(this.period == 3){
                    if(this.stoped == 0 )  return `每月第${this.periodMoth || 1}天开始`;
                    if(this.stoped == 1 )  return `每月第${this.periodMoth || 1}天开始 循环${this.stopedNum || 1}次`;
                    if(this.stoped == 2 )  return `每月第${this.periodMoth || 1}天开始 ${this.stopedDate}停止`;
                }
            }
        },
        methods : {
            setValue (data){
                if(!data || typeof data !== 'object'){
                    return ;
                }
                this.period = data.period || 0;  //更新周期
                this.stoped = data.stoped || 0;  //更新循环类型
                if(data.period == 2){
                    this.periodWeek = data.periodValue;
                }
                if(data.period == 3){
                    this.periodMoth = data.periodValue;
                }
                if(data.stoped == 1){
                    this.stopedNum = data.stopedValue;
                }
                if(data.stoped == 2){
                    this.stopedDate = moment(data.stopedValue).format('YYYY-MM-DD');
                }
            },
            weekDay (num){
                if(num == 1 ) return '一';
                if(num == 2 ) return '二';
                if(num == 3 ) return '三';
                if(num == 4 ) return '四';
                if(num == 5 ) return '五';
                if(num == 6 ) return '六';
                if(num == 7 ) return '日';
            },
            enter (){
                this.visible = false;
                if(this.period == 0 ){      //不循环
                    this.$emit('enter', {
                        data : false,
                        desc : this.desc
                    });
                }
                let stopvalue, select;
                if(this.stoped == 0) stopvalue = -1;
                if(this.stoped == 1) stopvalue = this.stopedNum || 1;
                if(this.stoped == 2) stopvalue = this.stopedDate;

                if(this.period == 1 ){      //按天
                    select = {
                        period : this.period,
                        stoped : this.stoped,
                        stopedValue : stopvalue
                    };
                    this.$emit('enter',{
                        data : select,
                        desc : this.desc
                    });
                    return ;
                }
                if(this.period == 2 ){      //按周
                    select = {
                        period : this.period,
                        periodValue : this.periodWeek,
                        stoped : this.stoped,
                        stopedValue : stopvalue
                    };
                    this.$emit('enter',{
                        data : select,
                        desc : this.desc
                    });
                    return ;
                }
                if(this.period == 3 ){      //按月
                    select = {
                        period : this.period,
                        periodValue : this.periodMoth || 1,
                        stoped : this.stoped,
                        stopedValue : stopvalue
                    };
                    this.$emit('enter',{
                        data : select,
                        desc : this.desc
                    });
                    return ;
                }
            },
            close () {
                this.visible = false;
                this.$emit('close');
            },
            //次数失去焦点
            stopedBlur (e){
                if(!this.stopedNum) this.stopedNum = 1;
            },
            periodBlur(){
                if(!this.periodMoth) this.periodMoth = 1;
            },
        }
    }

</script>
