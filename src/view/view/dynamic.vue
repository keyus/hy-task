<template>
  <div>
    <ul class="event-dynamic-ct time-line">
      <li class="event-list" v-for="(it,index) in list" :key="index" :class="{'first-event' : index+1 == list.length }">
        <div class="year-line-start" v-show="ifShowYear(index)">
          <div class="time-y">{{ it.createTime | getYear }}年</div>
          <span class="year-circle-icon icon"></span>
        </div>
        <div class="event-time-left">
          <div class="time-hm">{{ it.createTime | getHHMM }}</div>
          <div class="time-md">{{ it.createTime | getMMDD }}</div>
        </div>
        <div class="time-circle-icon icon"></div>
        <task-avatar :avatar="it.user" width="16px" height="16px" class="time-circle-icon"></task-avatar>

        <div class="event-detail-right">
          <div class="event-user">{{ it.user.userName }}</div>
          <div class="event-description">{{ it.description}}</div>
          <ul class="attacheMents-ct">
            <li class="event-attachment" v-for="file in it.attacheMents" >
              <span class="attachment-icon icon" ></span>
              <span class="attachment-name" @click="downloadFile(file)">{{ file.fileName }}</span>

              <span class="icon attachment-end-icon" v-show="file.latest == 1"></span>
            </li>
          </ul>
        </div>
        <span class="year-circle-icon icon" v-show="index+1 == list.length"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        list : [],
        pageCount : 0
      }
    },
    computed : {
      ...mapState({
        user : 'user'
      }),
      taskId () {
        return this.$route.query.taskId;
      },
      query () {
        return {
          pageSize : 10,
          pageNumber : 1,
          taskId : this.taskId,
          userId : this.user.cn
        }
      }
    },
    created () {
      this.init();
    },
    methods : {
      async init(){
        try {
          let res         = await this.$api.getDynamic(this.taskId,this.query);
          if(res.code === 200){
            this.pageCount  = res.data.pages.pageCount;
            this.list       = res.data.pages.results;
          }
          console.log(res)
        } catch (e) {}
      },
      ifShowYear (index) {
        let getCurItemYear = moment(this.list[index].createDate).year();
        let getLastItemYear = index > 0 ? moment(this.list[index - 1].createDate).year() : getCurItemYear;
        if (index > 0 && getCurItemYear == getLastItemYear) {
          return false;
        } else {
          return true;
        }
      },
    },
    filters: {
      getHHMM: function (val) {
        return moment(val).format('hh:mm');
      },
      getYear: function (val) {
        return moment(val).year();
      },
      getMMDD: function (val) {
        return moment(val).format('MM-DD')
      }
    }
  }
</script>
