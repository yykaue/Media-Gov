/**
 * Created by Limbo on 2017/7/10.
 */
var COMMON = {
    IP: 'http://192.168.1.68',
    PORT: 8080,
    URL: 'http://192.168.1.68:8080/' ,
    GET: 'GET',
    POST: 'POST'
};

function ajax(option) {
    var def = $.Deferred();
    var canceled = false;

    var jqXHR = $.ajax({
        url: option.url,
        data: JSON.stringify(option.data),
        type: option.type,
        xhrFields: {
            withCredentials: false
        },
        crossDomain: false,
        dataType: option.dataType || "JSON",
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        global: option.global !== false,
        async: option.async !== false,
        error: function (xhr, status, error) {
            console.log(this.dataType);
            if (canceled) return;
            var data = {
                result: 4,
                message: error,
                status: status
            };
            console.error("调用接口:[" + this.url + "]报错;状态码:[" + xhr.status + "];错误信息:[" + error + "]");
            def.reject(data);
        },
        success: function (data) {
            if (canceled) return;
            def.resolve(data);
        }
    });

    var promise = def.promise();
    var then = promise.then;
    var thenWrapper = function () {
        var promise = then.apply(this, arguments);
        promise.cancel = function () {
            canceled = true;
            jqXHR.abort();
        };
        promise.then = thenWrapper;
        return promise;
    };
    promise.then = thenWrapper;

    return promise;
}

function dealOption(option) {
    if (option.isLocal !== true) {
        option.url = COMMON.URL + option.url;
        // console.log(option);
    }
    return option;
}

function get(option) {
    option.type = option.type || COMMON.GET;
    return ajax(dealOption(option));
}

function post(option) {
    option.type = option.type || COMMON.POST;
    return ajax(dealOption(option));
}

// 如果回调函数错误就抛出异常不再执行并打印错误信息。
function isFunctionJsufoun(callback) {
    if (!$.isFunction(callback)) {
        try {
            throw new Error("回调函数定义错误！");
        } catch (e) {
            console.log(e.name + ": " + e.message);
            console.log(e.stack);
        }
    }
}
function vagilityRankList (parameter, callback) {
    isFunctionJsufoun(callback);
    return get({
        url: 'Temporary/index/vagilityRankList?starttime=2017-06-11&endtime=2017-7-07&webtype=1&type=2&page=1&rows=10'
    }).then(callback);
}