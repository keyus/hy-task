import Vue from 'vue'
import Vuex from 'vuex'
import taskEditable from './taskEditable'
import taskModel from './taskModel'
Vue.use(Vuex);

//当前时间
export const nowDate     = moment().format('YYYY-MM-DD');
//1年前
export const oneYearAgo  = moment().subtract(1, 'years').format('YYYY-MM-DD');

let store = new Vuex.Store({
  state: {
    nowDate    ,
    oneYearAgo ,
    //file url
    fs   : '',
    //login user
    user : {
      // cn : "1007",
      // companyId : "100196",
      // head : "",
      // sex : "0",
      // userName :"A"
    },
    centerId : '',
    //我的任务-过滤器参数
    myTaskFilter : {
      completion  : '',
      eCreateTime : nowDate,
      eEndTime : '',
      pageNo : 1,
      pageSize : 10,
      sCreateTime : oneYearAgo,
      sEndTime : '',
      status : [1,2,3,4],
      userId : '',
    },
    //任务中心-过滤器参数
    taskCenterFilter : {
      createBegin  : oneYearAgo,
      createEnd : nowDate,
      endDate1 : '',
      endDate2 : '',
      id : '',
      pageNo : 1,
      pageSize : 10,
      status : '1,2,3',
      type : '1,2',
      userId : '',
    },
    //统计分析过滤器
    taskCountFilter  : {
      eCreateTime : nowDate,
      eEndTime : "",
      pageNo : 1,
      pageSize : 17,
      sCreateTime : oneYearAgo,
      sEndTime : "",
      status : [0],
      userId :""
    },

    //任务详情-大概的API模型
    task : {
      concerns : [],                          //关注人
      creator : {                             //任务创建人，不可变
        cn: '',
        companyId: '',
        head: '',
        sex: '',
        userName: ''
      },
      manager : {                             //任务负责人-唯一
        cn: '',
        companyId: '',
        head: '',
        sex: '',
        userName: ''
      },
      members : [],
      takeOverUser : {                        //任务领取人，或者指派人
        cn: '',
        companyId: '',
        head: '',
        sex: '',
        userName: ''
      },
      task : {
        name : '',
        opened  : 1,
        urgency : 0,
        endDate : nowDate,
        beginDate : nowDate,
      },
      periodModel : {},      //周期模型，非API原生数据，后期注入进来的用于更新的数据模型
      filesModel  : []             //附件模型，非API原生数据，后期注入进来的用于更新的数据模型
    },
    //task menus
    taskMenus : {
      concerns      : false,
      notice        : false,
      period        : false,
      taskChild     : false,
    },
    //任务源详情
    source : {
      ...taskModel,
      type : ''   //当前打开类型
    },
    //上传文件状态
    fileLoading : false,
    //是否触发加载下一页任务评论
    loadingNextPageComment : false,

  },

  getters : {
    taskId (state) {
      return state.task.task.id;
    },
    //查看任务时，当前用户的角色身份
    taskRole (state) {
      let model = {
        creator   : false,    //创建人
        manager   : false,    //负责人
        members   : false,    //参于人
        concerns  : false,    //关注人
      };
      let cn   = state.user.cn;
      let task = state.task;
      if( cn === task.creator.cn) model.creator = true;
      if( cn === task.manager.cn) model.manager = true;
      task.members.forEach(it=>{
        if(it.cn ===  cn) model.members = true;
      });
      task.concerns.forEach(it=>{
        if(it.cn ===  cn) model.concerns = true;
      });
      return model;
    },
    //查看任务时，此任务的完成情况
    taskStatus(state) {
      let detail = state.task.task;
      return {
        overdue     : detail.overdue,        //逾期
        locked      : detail.locked,         //锁定
        finished    : detail.status === 3,   //完结
      }
    },
    //获取当前任务的更新模型
    getUpdateTaskModel (state) {

      let detail = state.task;
      let concerns = [];
      let members  = [];
      let period   = {};
      let files    = [];

      detail.concerns.forEach( it=> concerns.push(it.cn) );
      detail.members.forEach( it=> members.push(it.cn) );
      if(detail.periodModel) period = detail.periodModel;
      if(detail.filesModel) files = detail.filesModel;

      return {
        beginDate       : detail.task.beginDate,
        concerns        : concerns.join(','),
        description     : detail.task.description,
        endDate         : detail.task.endDate,
        fileNames       : files,
        groups          : detail.task.groups,
        id              : detail.task.id,
        manager         : detail.manager.cn,
        members         : members.join(','),
        name            : detail.task.name,
        notice          : detail.task.notice,
        opened          : detail.task.opened,
        parentId        : detail.task.parentId,
        rate: {
          description   : detail.task.rateDesc,
          value         : detail.task.rate
        },
        period          : period.period,
        periodValue     : period.periodValue,
        stoped          : period.stoped,
        stopedValue     : period.stopedValue,
        type            : detail.task.type,
        urgency         : detail.task.urgency,
        userId          : state.user.cn
      }

    },

    getUpdateSourceModel(state){
      let detail = state.source;
      let files    = [];
      if(detail.filesModel) files = detail.filesModel;

      //默认
      if(!detail.type){
        let members  = [];
        let manager  = detail.manager && typeof detail.manager === 'object' ? detail.manager.cn : '';
        detail.members.forEach( it=> members.push(it.cn) );
        return {
          beginDate       : detail.task.beginDate,
          concerns        : "",
          description     : detail.task.description,
          endDate         : detail.task.endDate,
          fileNames       : files,
          groups          : 0,
          id              : detail.task.id,
          manager         : manager,
          members         : members.join(','),
          name            : detail.task.name,
          notice          : 0,
          opened          : detail.task.opened,
          type            : detail.task.type,
          urgency         : detail.task.urgency,
          userId          : state.user.cn
        }
      }

      //新建
      if(detail.type === 'new'){
        return {
          beginDate       : detail.task.beginDate,
          description     : detail.task.description,
          endDate         : detail.task.endDate,
          fileNames       : files,
          id              : state.centerId,
          name            : detail.task.name,
          opened          : detail.task.opened,
          urgency         : detail.task.urgency,
          userId          : state.user.cn
        }
      }

      //指派
      if(detail.type === 'dispatch'){
        let members  = [];
        let manager  = detail.manager && typeof detail.manager === 'object' ? detail.manager.cn : '';
        detail.members.forEach( it=> members.push(it.cn) );
        return {
          beginDate       : detail.task.beginDate,
          description     : detail.task.description,
          endDate         : detail.task.endDate,
          fileNames       : files,
          manager         : manager,
          members         : members.join(','),
          opened          : detail.task.opened,
          taskId          : detail.task.id,
          urgency         : detail.task.urgency,
          userId          : state.user.cn
        }
      }

      //领取
      if(detail.type === 'get'){
        let members  = [];
        detail.members.forEach( it=> members.push(it.cn) );
        return {
          beginDate       : detail.task.beginDate,
          description     : detail.task.description,
          endDate         : detail.task.endDate,
          fileNames       : files,
          members         : members.join(','),
          opened          : detail.task.opened,
          taskId          : detail.task.id,
          urgency         : detail.task.urgency,
          userId          : state.user.cn
        }
      }

    },

    //根据state.task,获取当前任务哪些模块需要设为只读
    getTaskEditable(state,getters){
      Object.keys(taskEditable).forEach(key => taskEditable[key] = false);
      let status = getters.taskStatus;
      let role   = getters.taskRole;

      //锁定
      if(status.locked){
        if(role.creator){
          Object.keys(taskEditable).forEach(key => taskEditable[key] = true);
        }
        if(role.manager && !role.creator){
          ['rate','taskChild'].forEach(key => taskEditable[key] = true);
        }
        if(role.members && !role.manager && !role.creator){
          taskEditable.taskChild = true;
        }
      }
      //非完结-非锁定
      if(!status.finished && !status.locked){
        if(role.creator || role.manager){
          Object.keys(taskEditable).forEach(key => taskEditable[key] = true);
        }
        if(role.members && !role.manager && !role.creator){
          taskEditable.taskChild = true;
        }
      }
      return taskEditable;
    },

    getSourceEditable(state,getters){
      Object.keys(taskEditable).forEach(key => taskEditable[key] = false);
      let task = state.source;
      let isCreator = task.creator.cn === state.user.cn;
      //查看-创建人
      if(!task.type && isCreator){
        ['name','time','urgency','description','attachment','opened'].forEach(key => taskEditable[key] = true);
      }
      //指派
      if(task.type === 'dispatch'){
        ['manager','time','urgency','members','description','attachment','opened'].forEach(key => taskEditable[key] = true);
      }
      //领取
      if(task.type === 'get'){
        ['name','time','urgency','members','description','attachment','opened'].forEach(key => taskEditable[key] = true);
      }
      //领取
      if(task.type === 'new'){
        ['name','time','urgency','description','attachment','opened'].forEach(key => taskEditable[key] = true);
      }
      return taskEditable;
    },

    //任务详情模块可见性-只针对 更多区域，菜单控制的交互模块
    taskModuleVisible (state){
      return {
        concerns      : state.task.concerns.length || !state.taskMenus.concerns,
        notice        : state.task.task.notice || !state.taskMenus.notice,
        period        : state.task.task.period || !state.taskMenus.period,
        taskChild     : state.task.childTaskCount || !state.taskMenus.taskChild,
      }
    }
  },

  mutations: {
    updateFs (state,data){
      state.fs = data
    },
    updateUser (state,data){
      if(typeof data !== 'object') return ;
      state.user = data;
      state.myTaskFilter.userId = data.cn;
      state.taskCenterFilter.userId = data.cn;
      state.taskCountFilter.userId = data.cn;
    },
    updateCenterId (state,id){
      state.centerId = id;
    },
    //更新filter
    updateFilter (state,obj){
      if(typeof obj !=='object') return ;
      Object.keys(obj.data).forEach(key=>{
        if(state[obj.name].hasOwnProperty(key)) {
          state[obj.name][key] = obj.data[key];
        }
      })
    },
    //更新task-全量更新
    updateTask(state,data){
      if(typeof data === 'object'){
        state.task = Object.assign({},data);
      }
    },
    //更新source-全量更新
    updateSource(state,data){
      if(typeof data === 'object'){
        state.source.type = null;
        state.source.task.name = '';
        state.source = Object.assign({},data);
      }
    },
    updateFileLoading(state , val){
      state.fileLoading = val;
    },
    updateTaskRole(state , data){
      if(typeof data !== 'object') return ;
      state.taskRole = data;
    },
    updateTaskStatus (state , data){
      if(typeof data !== 'object') return ;
      state.taskStatus = data;
    },
    //锁定当前任务,仅从前端
    locked(state,val){
      state.task.task.locked = val;
    },
    updateLoadingNextPageComment(state,type){
      state.loadingNextPageComment = type;
    },
    updatePeriodModel(state,data){
      state.task.periodModel = data;
    },
    updateFilesModel(state,data){
      state.task.filesModel  = data;
    },
    updateTaskMenus(state,data){
      if(typeof data !== 'object') return ;
      state.taskMenus = data;
    },

  },

});

export default store;
