import Vue from 'vue'
import icon from '../utils/icon'

//紧急程度
Vue.filter('urgency', val =>{
  let text;
  switch (val){
    case 0 :
      text = '不重要不紧急';
      break;
    case 1 :
      text = '不重要紧急';
      break;
    case 2 :
      text = '重要不紧急';
      break;
    case 3 :
      text = '重要紧急';
      break;
    default :
      text = '重要紧急';
      break;
  }
  return text;
});

//来源
Vue.filter('from', val =>{
  let text;
  switch (val) {
    case 0:
      text = "自建";
      break;
    case 1:
      text = "自建";
      break;
    case 2:
      text = "公共邮箱";
      break;
    case 3:
      text = "个人邮箱";
      break;
    case 4:
      text = "即时消息";
      break;
    case 5:
      text = "日程";
      break;
    default:
      text = "未知来源";
      break;
  }
  return text;
});

//任务情况，进行中-完成-逾期
Vue.filter('situation', val =>{
  let text;
  switch (val) {
    case 1:
      text = "未开始";
      break;
    case 2:
      text = "进行中";
      break;
    case 3:
      text = "完成";
      break;
    case 4:
      text = "逾期";
      break;
    default:
      text = "进行中";
      break;
  }
  return text;
});



/**
 * 格式化文件类型
 */
Vue.filter('filetype', val =>{
  let fileType = val.indexOf(".") > 0 ? val.substring(val.lastIndexOf(".") + 1, val.length) : "";
  if (fileType.match(/(jpg|bmp|gif|jpeg|png)/i)) return icon.fileType.img;
  if (fileType.match(/(doc|docx)/i)) return icon.fileType.word;
  if (fileType.match(/(xls|xlsx)/i)) return icon.fileType.excel;
  if (fileType.match(/(ppt|pptx)/i)) return icon.fileType.ppt;
  if (fileType.match(/(pdf)/i)) return icon.fileType.pdf;
  if (fileType.match(/(text|txt)/i)) return icon.fileType.text;
  if (fileType.match(/(mpeg|mpg|dat|avi|mov|asf|wmv|rmvb|flv|f4v|mp4|3gp|amv|divx|mkv)/i)) return icon.fileType.video;
  if (fileType.match(/(rar|zip|7z)/i)) return icon.fileType.rar;
  if (fileType.match(/(wav|aiff|au|mp3|midi|wma|vqf|acc|ape|ra|rm|rmx|ogg)/i)) return icon.fileType.music;
  if (fileType.match(/(apk|ipa)/i)) return icon.fileType.app;
  if (fileType.match(/(exe)/i)) return icon.fileType.exe;
  return icon.fileType.other;
});

/**
 * 文件大小转换
 */
Vue.filter('filesize', val =>{
  let ret = "0 B";
  if (val) {
    let fileSize = parseFloat(val),
      model = 0,
      unit_arr = ["B", "KB", "MB", "GB", "TB"];
    for (let i = unit_arr.length - 1; i >= 0; i--) {
      model = fileSize / Math.pow(1024, i);
      ret = model >= 1 ? (model.toFixed(2).split(".")[1] == "00" ? model.toFixed(0) : model.toFixed(2)) + unit_arr[i] : false;
      if (ret) break;
    }
  }
  return ret;
});

/**格式化日期 2018-01-04 00:00:00 为年月日*/
Vue.filter('formatDate', val =>{
  return moment(val).format('YYYY-MM-DD');
});
