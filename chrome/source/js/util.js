/************** 服务器地址 ***************/
function getWebSiteUrl(){
    return getLocalData('crap-web-site-url', "http://api.crap.cn")
}
function setWebSiteUrl(url){
    if (url != null && (url.indexOf("http://") == 0 || url.indexOf("https://") == 0)){
        saveLocalData('crap-web-site-url', url);
        $("#set-website-button").text("修改服务器地址成功!");
    } else {
        $("#set-website-button").text("修改失败，地址不能为空，且必须以 https:// 或 http:// 开头!");
    }
}
/************* 插件广告 ****************/
function getAdvertisement() {
    try {
        var result = httpPost(ADVERTISEMENT, null, false, null, null);
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
    if (url.indexOf("https://") != 0 && url.indexOf("http://") != 0){
        url = getWebSiteUrl() + url;
    }
    var result;
    $.ajax({
        type: "POST",
        url: url,
        async: myAsync,
        data: myData,
        beforeSend: function (request) {
            // 通过body传递参数时后需要设置
            //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        complete: function (responseData, textStatus) {
            if (textStatus == "error") {
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"未知错误\",\"message\":网络异常\"\"}}")
            }

            else if (textStatus == "success") {
                var responseJson = $.parseJSON(responseData.responseText);
                result = responseJson;
                if (callBack) {
                    callBack(responseJson, callBackParams);
                }
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