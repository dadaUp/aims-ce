/************** 服务器地址 ***************/
var WEB_SITE_URL = "crap-web-site-url";
var WEB_HTTP_TIMEOUT = "crap-http-timeout";
function getHttpTimeout(){
    try {
        var httpTimeout = localStorage[WEB_HTTP_TIMEOUT];
        httpTimeout = parseFloat(httpTimeout);
        if (httpTimeout && httpTimeout != null && httpTimeout.toString() != "NaN" && httpTimeout > 1000) {
            return httpTimeout;
        } else {
            return 10000;
        }
    }catch(e){
        return 10000;
    }
}
function setHttpTimeout(httpTimeout){
    httpTimeout = parseFloat(httpTimeout);
    if (httpTimeout.toString() == "NaN" || httpTimeout < 1000) {
        $("#http-timeout-button").text("异常! 超时时间必须为数字，必须大于 1000!");
        return;
    }
    localStorage[WEB_HTTP_TIMEOUT] = httpTimeout;
    $("#http-timeout-button").text("超时时间修改成功!");
}

function getWebSiteUrl(){
    return getLocalData(WEB_SITE_URL, "http://api.crap.cn")
}
function setWebSiteUrl(url){
    if (url != null && (url.indexOf("http://") == 0 || url.indexOf("https://") == 0)){
        saveLocalData(WEB_SITE_URL, url);
        $("#set-website-button").text("修改服务器地址成功!");
    } else {
        $("#set-website-button").text("修改失败，地址不能为空，且必须以 https:// 或 http:// 开头!");
    }
}
/************* 插件广告 ****************/
function getAdvertisement() {
    try {
        httpPost(ADVERTISEMENT, null, true, getAdvertisementCallback, null);
    }catch (e){
        console.error(e);
    }
}
function getAdvertisementCallback(result) {
    try {
        if (result.text && result.text != '') {
            setHtml("id-advertisement-text", result.text);
            showDiv("id-advertisement-text");
        }
        if (result.imgUrl && result.imgUrl != '') {
            setAttr("id-advertisement-img", "src", result.imgUrl);
        }
        if (result.href && result.href != '') {
            setAttr("id-advertisement-href", "href", result.href);
        }
    }catch (e){
        console.error(e);
    }
}
/***********获取本地存储的数据**********/
function getLocalData(key, def){
    try{
        var value = localStorage[key];
        if(value && value != '' && value != 'undefined'){
            return value;
        }
        if (def) {
            return def;
        }else{
            return "[]";
        }
    }catch(e){
        console.error(e);
        if (def) {
            return def;
        }else{
            return "[]";
        }
    }
}
/*********存储数据至本地***********/
function saveLocalData(key,value){
    try{
        localStorage[key] = value;
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

function getLocalJson(key, def) {
    return $.parseJSON( getLocalData(key, def) );
}

/********* html基本操作方法**********/
function setHtml(id, html) {
    $("#" + id).html(html);
}
function showDiv(id) {
    $("#" + id).removeClass("ndis");
}
function hiddenDiv(id) {
    $("#" + id).addClass("ndis");
}
function fadeIn(id, time) {
    $("#" + id).fadeIn(time);
}
function fadeOut(id, time) {
    $("#" + id).fadeOut(time);
}
function getAttr(id, name) {
    return $("#" + id).attr(name);
}
function setAttr(id, name, value) {
    $("#" + id).attr(name, value);
}
function getValue(id) {
    if ($("#" + id)){
        return $("#" + id).val();
    }
    return null;
}
function setValue(id, val) {
    $("#" + id).val(val);
}

function prop(id) {
    $("#" + id).prop("checked",true);
}

/********* http *******/
function httpPost(url, myData, myAsync, callBack, callBackParams){
    if (myAsync){
        $("#" + ID_FLOAT).fadeIn(300);
    }
    if (url.indexOf("https://") != 0 && url.indexOf("http://") != 0){
        url = getWebSiteUrl() + url;
    }
    var httpTimeout = getHttpTimeout();
    var result;
    $.ajax({
        type: "POST",
        url: url,
        async: myAsync,
        data: myData,
        timeout: httpTimeout,
        beforeSend: function (request) {
            // 通过body传递参数时后需要设置
            //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        complete: function (responseData, textStatus) {
            if (textStatus == "error" && responseData.responseText == "") {
                alert("网络异常，Status:" + responseData.status + "\nStatusText:" + responseData.statusText, 5, "error");
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"未知错误\",\"message\":\"网络异常\"}}")
            }

            else if (textStatus == "error" && responseData.responseText != "") {
                alert("网络异常，Status:" + responseData.status + "\nStatusText:" + responseData.statusText + "\nResponseText: " + responseData.responseText , 5, "error");
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"未知错误\",\"message\":\"" + responseData.responseText + "\"}}")
            }

            else if (textStatus == "success") {
                var responseJson = $.parseJSON(responseData.responseText);
                result = responseJson;
                if (callBack) {
                    callBack(responseJson, callBackParams);
                }
            }

            else if (textStatus == "timeout") {
                alert("网络超时异常，请检查服务器地址、网络是否正常，Status:" + responseData.status + "\nStatusText:" + responseData.statusText, 5, "error");
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"网络超时异常\",\"message\":\"网络超时异常，请检查服务器地址、网络是否正常\"}}")
            }

            else {
                alert("未知异常，Status:" + responseData.status + "\nStatusText:" + responseData.statusText, 5, "error");
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"未知错误\",\"message\":\"未知错误\"}}")
            }
            if (myAsync) {
                $("#" + ID_FLOAT).fadeOut(300);
            }
        }
    });
    return result;
}
function jsonFormat(txt, tiperror){
    try {
        var txtObj = JSON.parse(txt);
        return JSON.stringify(txtObj, null, 5);
    }catch (e){
        if (tiperror){
            alert("格式化异常，请检查json格式是否有误" + e);
        }
        return txt;
    }
}