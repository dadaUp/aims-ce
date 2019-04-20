var leftEnlarge = true;

function hasConsumer() {
    if( getValue(ID_METHOD) == "POST" || getValue(ID_METHOD) == "PUT"){
        return true;
    }
    return false;
}
function formatJson(){
    var rowData = originalResponseText;
    if( rowData == ""){
        rowData = $("#response-row").val();
    }
    if(rowData == ""){
        alert("Please click [Send] button to get a response");
        return false;
    }
    try {
        $.parseJSON( rowData );
    } catch (e) {
        console.warn(e);
        alert("Response data is not json");
        return;
    }
    if( $("#response-row").hasClass("hidden") == false){
        $("#response-row").addClass("hidden");
    }
    $("#response-pretty").removeClass("none");
    $("#response-pretty").JSONView(rowData);
    return true;
}

function changeBg(removeClass, addClass, selectClass,click_button){
    $("."+selectClass).removeClass(addClass);
    $("."+selectClass).addClass(removeClass);
    $(click_button).removeClass(removeClass);
    $(click_button).addClass(addClass);
}

function responseShow(showDiv){
    if( showDiv == "response-row"){
        if( $("#response-row").hasClass("hidden")){
            $("#response-row").removeClass("hidden");
        }
        if( $("#response-pretty").hasClass("none") == false){
            $("#response-pretty").addClass("none");
        }
    }else if( showDiv == "response-pretty"){
        if( $("#response-row").hasClass("hidden") == false){
            $("#response-row").addClass("hidden");
        }
        $("#response-pretty").removeClass("none");
    }

}

function getHeadersStr(){
    var headers = "";
    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                if(key.trim() != "" || val.value.trim() != ""){
                    headers += "&"+key + "=" + val.value
                }
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
    return headers;
}

function getHeaders(request){
    if( $("#id-method").val() == "POST") {
        request.setRequestHeader("Content-Type", $('input:radio[name="param-type"]:checked').val());
    }

    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                request.setRequestHeader(key, val.value);
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
}

/**
 * 返回形式：xxx=11&xx=333
 * @returns {string}
 */
function getParams(){
    var texts = $("#params-div input[type='text']");
    var data = "";
    // 获取所有文本框
    var key = "";

    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage")  == "value"){
                if( key != "") {
                    data += "&" + key + "=" + val.value;
                }
            }else if(val.getAttribute("data-stage")  == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(e);
            alert(ex);
        }
    });
    return (data.length > 0 ? data.substr(1) : data);
}

function getPramsInUrl(params) {
    var urlParamsStr = "";
    params = "&" + params;
    // 表单参数优先url参数，post中没有的才使用url中的参数
    if( getValue(ID_URL).indexOf("?") > 0){
        urlParamsStr = getValue(ID_URL).split("?")[1];
        var urlParams = urlParamsStr.split("&");
        for(var i=0; i<urlParams.length; i++ ){
            if( urlParams[i] != "" && urlParams[i].indexOf("=") > 0){
                if(params.indexOf("&" + urlParams[i].split("=")[0]) < 0){
                    params += (params.length > 1 ? "&" + urlParams[i] : urlParams[i]);
                }
            }
        }
    }
    return params.substr(1);
}
var originalResponseText = "";
function callAjax() {
    if (getValue(ID_URL).trim() == null || getValue(ID_URL).trim() == ''){
        $("#response-row").val("Url地址不能为空");
        $(".response-header .headers").html("");
        $(".response-header .general").html("");
        $("#response-pretty").html("");
        $("#format-row").click();
    }
    originalResponseText = "";
    var url = getValue(ID_URL).trim().split("?")[0];
    var method = getValue(ID_METHOD);
    var params =  getPramsInUrl(getParams());
    // 自定义参数
    if(hasConsumer && $.inArray($('input:radio[name="param-type"]:checked').val(), customerTypes) != -1){
        params = $("#customer-value").val();
    }

    $("#float").fadeIn(300);
    var httpTimeout = getHttpTimeout();
    $.ajax({
        type : method,
        url : url,
        async : true,
        data : params,
        timeout: httpTimeout,
        beforeSend: function(request) {
            getHeaders(request);
            $("#response-row").val("");
            $(".response-header .headers").html("");
            $(".response-header .general").html("");
            $("#response-pretty").html("");
            $("#format-row").click();
        },
        complete: function(responseData, textStatus){
            if(textStatus == "success" || (textStatus == "error" && responseData.responseText != "")){
                try{
                    originalResponseText = responseData.responseText;
                    var data = responseData.responseText;
                    $("#response-row").val(data);
                    var head = responseData.getAllResponseHeaders().toString().huanhang();
                    $(".response-header .headers").html(head);
                    var general ="Request URL: " + url +"<br>Request Method: " + method +"<br>Status Code: " + responseData.status;
                    $(".response-header .general").html(general);
                    $("#response-pretty").html("");

                    var rootDomainStr =getRootDomain(url);
                    chrome.cookies.getAll({domain: rootDomainStr}, function(cookies){
                        $(".response-cookie .table tr").empty();
                        $(".response-cookie .table").append("<tr class='fb'><td>Name</td> <td>Value</td> <td>Path</td><td>Domain</td><td>ExpirationDate</td></tr>");
                        var a =  document.createElement('a');
                        a.href = url;
                        for(i=0; i<cookies.length;i++) {
                            if( ("."+a.host).endWith(cookies[i].domain) ){
                                var cookieStr = "<tr>";
                                cookieStr += "<td class='w-p-10 break-word'>" + cookies[i].name + "</td>";
                                cookieStr += "<td class='w-p-30 break-word'>"  + cookies[i].value + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>"  + cookies[i].path + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].domain +"</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].expirationDate +"</td>";
                                cookieStr += "</tr>";
                                $(".response-cookie .table").append(cookieStr)
                            }
                        }
                    });
                }catch(e){
                    $("#format-row").click();
                }

                try {
                    data = $.parseJSON( data );
                    $("#json-expand").click();
                } catch (e) {
                    $("#format-row").click();
                }
            }else{
                $("#response-row").val("textStatus: " + textStatus +"\n\n There was an error connecting to " + url);
                $("#format-row").click();
            }
            $("#float").fadeOut(300);
        }
    });

    if( method == "GET"){
        setValue(ID_URL, params.trim() != "" ? url + "?" + params : url);
    }

    // 记录历史
    try{
        var history = getLocalJson(DATA_HISTORY);
        if(  $.inArray($('input:radio[name="param-type"]:checked').val(), customerTypes) == -1) {
            params = params.replace(/=/g, ":").replace(/&/g,"\n");
        }

        var h  ={"paramType": $("input[name='param-type']:checked").val(), "name": getValue(ID_INTERFACE_NAME),"method":method, "url" : url,
            "params" : params, "headers": getHeadersStr().replace(/=/g, ":").replace(/&/g,"\n")};

        // 如果已经存在则删除
        for(var i=0; i<history.length;i++){
            if(JSON.stringify(history[i]) == JSON.stringify(h)){
                history.splice(i,1);
            }
        }

        history.unshift(h);
        // 如果历史记录>20，则删除最后一个
        if(history.length > 20){
            history.pop();
        }
        // 保存历史数据
        saveLocalData(DATA_HISTORY, JSON.stringify(history))
    }catch(e){
        console.warn(e);
    }
    daoDrawHistory();
}

function getRootDomain(url) {
    var a =  document.createElement('a');
    a.href = url;
    var hosts =a.host.split('.');
    return hosts.length ==2 ? a.host : hosts[hosts.length-2]+"."+hosts[hosts.length-1];
}

/************************覆盖弹框**************************************/
function alert(tipMessage, tipTime, isSuccess, width){
    if( !width){
        width = 200;
    }
	tipTime = tipTime?tipTime:2;
	if(tipMessage!=""){
		if(tipMessage!="false"&&tipMessage!=false) {
            $("#alert-div").html(tipMessage);
            if (tipMessage.length > 35){
                width = 300;
            }
            if (tipMessage.length > 75){
                width = 500;
            }
            if (tipMessage.length > 150){
                width = 800;
            }
        }
	}
	$("#alert-div").css("left",  ($(window).width()/2 - width/2) +"px").css("width", width+"px");
    $("#alert-div").removeClass("text-success");
    $("#alert-div").removeClass("text-error");
    $("#alert-div").addClass("text-" + isSuccess);

	showMessage("alert-div",tipMessage,false,tipTime);
}

/************************覆盖弹框**************************************/
function tip(response, tipTime, successMessage){
    var isSuccess = response.success;

    var tipMessage = successMessage;
    if (isSuccess == 1 || isSuccess == "success"){
        isSuccess = "success";
        if (!successMessage) {
            tipMessage = "操作成功！";
        }
    }else {
        isSuccess = "error";
        tipMessage = "错误信息:" + response.error.message;
    }
    tipTime = tipTime?tipTime:2;
    if(tipMessage!=""){
        if(tipMessage!="false"&&tipMessage!=false) {
            $("#" + ID_TIP).html(tipMessage);
        }
    }

    $("#" + ID_TIP).removeClass("text-success");
    $("#" + ID_TIP).removeClass("text-error");
    $("#" + ID_TIP).addClass("text-" + isSuccess);
    showMessage(ID_TIP,tipMessage,false,tipTime);
}
/** *********************页面提示信息显示方法************************* */
/**
 * 显示的div，提示信息，是否晃动，自动隐藏时间：-1为不隐藏，其它为隐藏时间（单位秒) message
 * 为false时表示不需要提示信息，仅需要显示div即可
 */
function showMessage(id,message,ishake,time){
    if(message!=""){
        if(message!="false"&&message!=false)
            $("#"+id).html(message);
        $("#"+id).fadeIn(300);
        if(ishake){
            shake(id);
        }
        if(time!=-1){
            if(isNaN(time))
                time=2000;
            else if(time>0)
                time = time * 1000;
            setTimeout(function(){
                if(time!=0){
                    $("#"+id).fadeOut(500);
                }
                else{
                    $("#"+id).fadeOut(300);
                }
                $("#"+id).hide("fast");
            },time);
        }
    }
}
// 晃动div
function shake(o){
    var $panel = $("#"+o);
    var box_left =0;
    $panel.css({'left': box_left});
    for(var i=1; 4>=i; i++){
        $panel.animate({left:box_left-(8-2*i)},50);
        $panel.animate({left:box_left+2*(8-2*i)},50);
    }
}

String.prototype.endWith=function(endStr){
    var str = this;
    if(endStr.length == 0 || this.length == 0){
        return false;
    }
    if(str.length < endStr.length){
        return false;
    }
    str = str.substr(str.length - endStr.length);
    return (str == endStr)
}
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
String.prototype.huanhang = function () {
    return this.replace(/\n/g, "<br>");
}
function handerStr(str){
    if( !str || str.trim() == "" || str == "NaN" || str == "undefined" || str == "-1"){
        return "";
    }
    return str.trim();
}
