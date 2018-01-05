import fetch from '../utils/fetch'
import queryString from 'query-string'

const baseUrl         = "/plugin-task/v1";
const urlQuery        = queryString.parse(location.href.split('?')[1]);
let   downloadIframe  = '';

let user = {
  cn      : urlQuery.jid,
  fileUrl : '',
}

export default user;

//文件服务器地址
export const FS = ()=>{
  return fetch(`${baseUrl}/task/rest/address/HTTP`);
}

//获取登陆用户信息
export const getUser = ()=>{
  return fetch(`${baseUrl}/mytask/get/users?cns=${user.cn}`);
}

//我的任务-列表
export const getMyTaskList = (data)=>{
  return fetch(`${baseUrl}/mytask/${user.cn}/tasklist`,data,'post');
}

//任务中心-任务列表
export const getTaskCenterList = (data)=>{
  return fetch(`${baseUrl}/taskCenter/task/list`,data,'post');
}

//任务中心-任务中心名称列表
export const getTaskCenterName = ()=>{
  return fetch(`${baseUrl}/taskCenter/list?userId=${user.cn}`);
}

//任务中心-任务中心详情
export const getTaskCenterDetail = (id)=>{
  return fetch(`${baseUrl}/taskCenter/detail/${id}?userId=${user.cn}`)
}

//任务中心-更新
export const updateTaskCenter = (data)=>{
  return fetch(`${baseUrl}/taskCenter/update`,data,'post');
}

//任务中心-创建
export const createTaskCenter = (data)=>{
  return fetch(`${baseUrl}/taskCenter/create`,data,'post');
}

//任务中心-成员列表
export const getTaskCenterMember = (centerId)=>{
  return fetch(`${baseUrl}/taskCenter/members/list?userId=${user.cn}&id=${centerId}`);
}

//统计分析-图表
export const getCountCharts = (data)=>{
  return fetch(`${baseUrl}/statistics/${user.cn}/task`,data,'post');
}

//统计分析-列表
export const getCountList = (data)=>{
  return fetch(`${baseUrl}/statistics/${user.cn}/task/list`,data,'post');
}

//新建任务
export const createTask = (data)=>{
  return fetch(`${baseUrl}/task/create/first`,data,'post');
}

//搜索-奇葩的API
export const search = (data)=>{
  let dataStr = '';
  Object.keys(data).forEach(key => {
    dataStr += key + '=' + data[key] + '&';
  });

  return fetch(`${baseUrl}/mytask/search?${dataStr}`,'','post');
}


/***任务详情***/

/**获取任务详情*/
export const getTask = (id)=>{
  return fetch(`${baseUrl}/mytask/${id}/taskdetail?&userId=${user.cn}`);
};
/**
 * 获取回执列表
 * @param taskId
 */
export const getComment = (taskId='',pageNumber=1,pageSize=20)=>{
  return fetch(`${baseUrl}/mytask/${taskId}/response?userId=${user.cn}&pageSize=${pageSize}&pageNumber=${pageNumber}`);
};
/**
 * 文件下载方式
 * @param file
 * @param type 下载方式默认为post
 * @token tokey
 * fileInfo[file.fileUri] = file.fileName
 */

export const downloadFile = (file, token = '123456')=>{
  let filename    = encodeURIComponent(file.fileName  || file.name);
  let url         = user.fileUrl + '/FS/resource/download';
  let donwloadUrl = `${url}/?fileInfo['${file.fileId || file.fileUri || file.id}']=${filename}&token=${token}`;
  if(!downloadIframe){
    let iframe = document.createElement("iframe");
    downloadIframe = iframe;
    document.body.appendChild(downloadIframe);
  }
  downloadIframe.src = donwloadUrl;
  downloadIframe.style.display = 'none';
};

/**
 * 删除回执
 **/
export const deleteComment = (data)=>{
  return fetch(`${baseUrl}/task/response/delete`,data,'post');
};

/**
 * 获取子回执列表-坑爹啊，这个API，接口的baseurl是大写的V1
 * @param taskId
 */
export const getCommentChild = (id)=>{
  return fetch(`/plugin-task/V1/comment/${id}/detail?pageSize=10000`);
};
/**
 * 删除子评论
 * */
export const deleteCommentChild = (id)=>{
  return fetch(`/plugin-task/V1/comment/delete/${id}/${user.cn}`, '','post');
};


/***
 * 创建回执消息
 */
export const createComment = (data)=>{
  return fetch(`${baseUrl}/task/response/create`,data,'post');
};
/**
 * 回复子评论
 * */
export const createCommentChild = (data={})=>{
  return fetch('/plugin-task/V1/comment/create',data,'post');
};


//上传文件
export const uploadFile = ( options = {})=>{
  let xhr         = new XMLHttpRequest();
  let formData    = new FormData();
  let data        = {
    size        : options.file.size,
    token       : 123456,
    valiType    : "public",
    sysId       : "plugin-task"
  };
  Object.keys(data).forEach( key => {
    formData.append(key,data[key]);
  });
  formData.append('file',options.file.file);
  try {
    xhr.upload.addEventListener("progress", e => options.progress(e));
    xhr.addEventListener("load", e=>  options.load(e));
    xhr.addEventListener("error", e=>  options.error(e));
    xhr.addEventListener("abort", e=>  options.abort(e));
    xhr.open("post", `${user.fileUrl}/FS/resource/upload`);
    xhr.send(formData);
  }catch (error) {
    options.error();
  }
  return xhr;
};

//子任务列表
export const taskChild = (taskId = 6)=>{
  return fetch(`${baseUrl}/task/children/list?userId=${user.cn}&taskId=${taskId}`);
};


//添加子任务
/***
 * data {} data.name :"fsdferw",  data.parentId  :  6, data.userId :  "10097"
 */
export const taskChildAdd = (data = {})=>{
  return fetch(`${baseUrl}/task/create/first`,data,'post');
};

/**获取任务附件列表*/
export const getAttachments = (id)=>{
  return fetch(`${baseUrl}/mytask/${id}/attachment?userId=${user.cn}&pageSize=10000&pageNumber=1&type=1`);
};


/**修改任务锁定-完结-删除-解锁 对象key
 * taskId
 * type
 * userId
 * */
export const updateState = (data)=>{
  return fetch(`${baseUrl}/task/operate`,data,'post');
};

/**获取进度
 * id : 任务ID
 * */
export const getRate = (id)=>{
  return fetch(`${baseUrl}/task/rate/list?id=${id}&userId=${user.cn}`);
};
//更新任务详情
export const updateTask = (data)=>{
  if(!data || typeof data !== 'object') return ;
  return fetch(`${baseUrl}/task/update`,data,'post');
};

//指派任务
export const assignTask = (data)=>{
  if(!data || typeof data !== 'object') return ;
  return fetch(`${baseUrl}/mytask/assign/task`,data,'post');
};

//领取任务
export const receiveTask = (data)=>{
  if(!data || typeof data !== 'object') return ;
  return fetch(`${baseUrl}/mytask/receive/task`,data,'post');
};

//创建任务源
export const createSource = (data)=>{
  if(!data || typeof data !== 'object') return ;
  return fetch(`${baseUrl}/taskCenter/task/create`,data,'post');
};

//动态列表
export const getDynamic = (id,data)=>{
  return fetch(`${baseUrl}/mytask/${id}/event`,data);
};
