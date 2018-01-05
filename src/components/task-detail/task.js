//任务详情空模型

export let taskModel = {
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

  }
};

export let sourceModel = {

};

