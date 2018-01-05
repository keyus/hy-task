<template>
  <div class="task-item task-item-rate">
    <div class="task-item-lb"><label>进度</label></div>
    <div class="task-item-rb">
      <div class="task-rate">
        <progress-slider :class="{'hy-progress-notzero' : value2 !== 0 }"
                         :disabled="!editable"
                         :value.sync="value2"
                         @progress-mouseup="progressMouseup"></progress-slider>
        <span class="task-rate-value">{{value2}}%</span>
      </div>

      <div class="task-rate-input" v-show="showInput">
        <textarea v-model="text"
                  placeholder="请输入进度描述"
                  maxlength="100"
                  ref="rateinput"
                  @blur="add"></textarea>
        <label>{{text.length}} / 100</label>
      </div>

      <div class="task-rate-list">
        <ul>
          <li v-for="it in list.slice(0,max2)"><span>{{it.rate}}% ：</span><p>{{it.description}}</p></li>
        </ul>
        <div class="toggle" @click="toggle" v-if="list.length>1">
          <a>
            <template v-if="extend">收起</template>
            <template v-else>展开</template>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
      name : 'taskRate',
      props : {
        value : {},
        desc  : {},
        taskId: {},
        max   : {
          type    : Number,
          default : 1
        },
        editable : {}
      },
      data() {
        return {
          value2    : this.value,
          text      : '',
          showInput : false,
          extend    : false,
          max2      : this.max,      //默认显示1条进度
          list      : [],            //进度列表
        }
      },
      watch : {
        value (val) {
          if (val === this.value2) return;
          this.value2 = val;
        },
        value2 (val) {
          this.$emit('update:value',val);
        },
        extend (val) {
          if(val){
            this.max2 = this.list.length;
          }else{
            this.max2 = 1;
          }
        },
      },
      created () {
        this.init();
      },
      methods : {
        async init(){
          try {
            let res   = await this.$api.getRate(this.taskId);
            let list  = res.data;
            if(Array.isArray(list) && list.length){
              this.list = list.filter(it=>it.description);
            }
          } catch (error){}
        },
        progressMouseup () {
          if(this.value2 == 0){
            this.showInput = false;
            return ;
          }
          this.showInput = true;
          this.extend    = true;
        },
        add(){
          if(!this.text){ this.showInput = false; return ;}
          this.list.unshift({
            rate        : this.value2,
            description : this.text,
          });
          this.$emit('update:desc',this.text);
          this.text       = '';
          this.showInput  = false;
          this.max2       = this.list.length;
        },
        toggle(){
          this.extend = !this.extend;
        }
      }
    }
</script>
