let now = moment().format('YYYY-MM-DD');
export default {
  centerName : '',
  concerns : [],
  creator : {
    cn: '',
    companyId: '',
    head: '',
    sex: '',
    userName: ''
  },
  manager : {
    cn: '',
    companyId: '',
    head: '',
    sex: '',
    userName: ''
  },
  members : [],
  takeOverUser : {
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
    endDate : now,
    beginDate : now,
  },
}
