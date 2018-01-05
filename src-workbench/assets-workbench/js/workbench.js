/****
 * 节流函数
 * @type {boolean}
 */
var _ = {};
_.now = Date.now || function() {
    return new Date().getTime();
};
_.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};


var fetch    = function (url, data, type) {
    url  = url || '';
    data = data || {};
    type = type || "GET";
    type = type.toUpperCase();
    if (type === 'GET') {
        var dataStr = ''; //数据拼接字符串
        for (var key in data){
            dataStr += key + '=' + data[key] + '&';
        }

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    return new Promise((resolve, reject) => {
        var requestObj;
        if (window.XMLHttpRequest) {
            requestObj = new XMLHttpRequest();
        } else {
            requestObj = new ActiveXObject;
        }

        var sendData = '';
        if (type === 'POST') {
            sendData = JSON.stringify(data);
        }
        requestObj.timeout = 10000;
        requestObj.ontimeout = ()=>{
            reject(requestObj)
        };
        requestObj.open(type, url, true);
        requestObj.setRequestHeader("Accept", "application/json");
        requestObj.setRequestHeader("Content-type", "application/json");
        requestObj.send(sendData);

        requestObj.onreadystatechange = () => {
            if (requestObj.readyState === 4) {
                if (requestObj.status === 200) {
                    var obj = requestObj.response
                    if (typeof obj !== 'object') {
                        obj = JSON.parse(obj);
                    }
                    resolve(obj)
                } else {
                    reject(requestObj)
                }
            }
        }
    })
};
var baseUrl  = '/plugin-task';
// var host     = 'http://172.17.186.172:8081';
var host     = '';

//任务应用地址
var getTaskUrl = function () {
    return fetch(host + baseUrl + '/v1/task/rest/address/TASK');
};
/**
 * 7日待处理任务 或已逾期的任务
 * @param userId    用户ID
 * @param type      查询类型 0 | 1
 * @param pageNo    页码
 * @param pageSize  分页大小
 */
var getLatelyTask = function (userId, type, pageNo, pageSize) {
    type        = type || 0;
    pageNo      = pageNo || 1;
    pageSize    = pageSize || 3;
    return fetch(host + '/' + baseUrl + '/v1/mytask/workbench/task/list',{
        pageNo : pageNo,
        pageSize: pageSize,
        type : type,
        userId: userId
    },'post')
};

var urlParse = function (url) {
    var o       = {} , arr = [], querys;
    querys      = (url || location.href).split("?")[1];
    querys      = querys && querys.split("&");
    Array.isArray(querys) && querys.length && querys.forEach((item) => {
        arr = item.split("=");
        o[arr[0]] = arr[1];
    });
    return o;
};

var query         = urlParse();

var app = function () {
    new Vue ({
        el : '.workbench-app' ,
        data : function () {
            return {
                loading     : false,    //加载中
                ismobile    : isMobile, //是否移动端
                userId      : '',       //用户ID
                list        : [],       //列表数据
                type        : 0,        //列表类型
                pageNo      : 1,        //列表页码
                pageSize    : 3,        //分页大小
                pageCount   : 0,        //总页数

                initFinish  : false,        //初始化api请求状态
            }
        },
        computed : {
            nodata : function (){
                return !this.list.length;
            },
            //是否存在上一页
            hasUp : function (){
                return this.pageNo > 1;
            },
            //是否存在下一页
            hasNext : function () {
                return this.pageCount > this.pageNo;
            }
        },
        mounted : function () {
            var vm = this;
            if(sessionStorage.getItem('tasktype')){
                this.type = sessionStorage.getItem('tasktype');
            }
            //pc computed show line
            if(!isMobile){
                this.computeLine();
                window.onresize = _.throttle(()=>{
                    this.computeLine();
                    host && this.init();
                },500)
            }
            if(query.jid){
                //为了兼容移动端 1007@isphere.top格式
                this.userId = query.jid.split('@')[0];
                getTaskUrl().then(function (res) {
                    host = res.TASK;
                    vm.init();
                },function () {
                    vm.initFinish = true;
                })
            }

        },
        methods : {
            //初始化模块
            init : function(){
                var vm              = this;
                sessionStorage.setItem('tasktype',this.type);
                this.list           = [];
                this.pageNo         = 1 ;        //列表页码
                this.loading        = true;
                getLatelyTask(this.userId,this.type,this.pageNo,this.pageSize).then(function (res) {
                    vm.initFinish = true;
                    if ( res.code === 200 ){
                        vm.list       = res.data.result.results;
                        vm.pageCount  = res.data.result.pageCount;
                        if(!Array.isArray(vm.list) || !vm.list.length){
                            vm.nodata         = true;
                        }
                    }
                    vm.loading        = false;
                },function () {
                    vm.initFinish   = true;
                    vm.loading        = false;
                    vm.nodata         = true;
                })
            },

            computeLine : function(){
                var height          = this.$refs.page.offsetHeight; //容器总高
                var line            = 45;                           //item高
                var pageHeight      = 30;                           //分页码高
                var listHeight      = height - pageHeight;          //列表高

                var pageSize        = Math.floor(listHeight / line);
                this.pageSize       = pageSize;
            },

            //切换任务列表
            toggleList : function (type){
                if(this.type === type) return ;
                this.type       = type;
                this.pageNo     = 1;
                this.init();
            },

            //切换分页 type 上一页 | 下一页 默认加
            togglePage : function (type){
                if(type === 'plus'){
                    if(this.pageNo >= this.pageCount ) return ;
                    this.pageNo += 1;
                } else {
                    if(this.pageNo <= 1 ) return ;
                    this.pageNo -= 1;
                }
                this.init();
            },

            //打开任务详情
            openTask : function(item){
                let url = host + '/plugin-task/pc/task/detail?source=1&jid=' +this.userId + '&taskId=' +item.taskId;

                if(isMobile) url = host + '/plugin-task/app/task/detail?taskId=' + item.taskId;
                window.top.postMessage({
                    url: url,
                    cid: query.cid || 'plugins.task'
                }, "*");
                item.hasEvent = false;
            }
        },
    });
}

//runing
app();
