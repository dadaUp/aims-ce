//点击luceneSearch时执行以下代码
$(function(){
    if ($("#hasInstallPlug")) {
        $("#hasInstallPlug").val(true);
        $("#has-plug").removeClass("none");
        $("#no-plug").addClass("none");
        $("#crap-debug-send-new").removeClass("none");
        $("#crap-debug-send").addClass("none");
    }

	// 从插件跳转至码云，自动弹出捐赠页面
	if(window.location.href == "http://git.oschina.net/CrapApi/CrapApi?autoDonate=true"){
		$(".modals").removeClass("hidden");
			$(".modals").removeClass("fade");
			$(".modals").removeClass("out");
			$(".modals").addClass("visible");
			$(".modals").addClass("active");
			
			$(".project-donate-modal").removeClass("hidden");
			
			$(".modals").css("display","block");
			$(".project-donate-modal").addClass("visible");
			$(".project-donate-modal").addClass("active");
			$(".project-donate-modal").css("margin-top","-289.5px");
    };

    $("#btn-cancel-donate").click(function(){
        window.location.href="http://git.oschina.net/CrapApi/CrapApi";
    });

    //$("#crap-debug-send-new").click(function () {
    $("body").on("click","#crap-debug-send-new",function() {
    	var method = $("#method").val();
        if (method.indexOf("POST") >= 0){
            method = 'POST';
        }else if (method.indexOf("GET") >= 0){
            method = "GET";
        }

        var url = $("#crap-debug-url").val();
        var paramType = $("#crap-debug-paramType").val();
        var params = "";
        if (paramType == "FORM"){
            var key = "";
            $.each( $("#editParamTable input[type='text']"), function(i, val) {
                if(val.name == "def"){
                    if( key != "") {
                        params += "&" + key + "=" + val.value;
                    }
                }else if(val.name == 'name'){
                    key = val.value;
                }
            });
            params = (params.length > 0 ? params.substr(1) : params);
        } else {
            params = $("#crap-debug-raw").val();
        }

        $("#float").fadeIn(300);

        var texts = $("#editHeaderTable input[type='text']");
        var key = "";
        var headers = {};
        $.each(texts, function(i, val) {
            if(val.name == "def"){
                if( key != "") {
                    headers[key] = val.value;
                }
            }else if(val.name == 'name'){
                key = val.value;
            }
        });

        var plugParams = {
            url: url,
            headers: headers,
            type: method,
            data: params,
            beforeSend: function (xhr) {
                xhr.beginTime = Date.now();
            },
            // dataType: this.content.contentType,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        };
        var ce = new CustomEvent('request', {
            detail: plugParams
        });
        document.dispatchEvent(ce);

        // $.ajax({
        //     type : method,
        //     url : url,
        //     async : true,
        //     data : params,
        //     beforeSend: function(request) {
        //         var texts = $("#editHeaderTable input[type='text']");
        //         var key = "";
        //         $.each(texts, function(i, val) {
        //             if(val.name == "def"){
        //                 if( key != "") {
        //                     request.setRequestHeader(key, val.value);
        //                 }
        //             }else if(val.name == 'name'){
        //                 key = val.value;
        //             }
        //         });
        //     },
        //     complete: function(responseData, textStatus){
        //         $("#crap-debug-result-div").removeClass("none");
        //         if(textStatus == "error"){
        //             $("#crap-debug-result").html("Status:" + responseData.status + "\nStatusText:" + responseData.statusText +"\nTextStatus: " + textStatus +"\nCould not get any response\n\nThere was an error connecting to " + url);
        //         }
        //         else if(textStatus == "success"){
        //             var data = responseData.responseText;
        //             try {
        //                 var txtObj = JSON.parse(data);
        //                 data = JSON.stringify(txtObj, null, 5);
        //                 $("#crap-debug-result").html(data);
        //             } catch (e) {
        //                 $("#crap-debug-result").html(data);
        //             }
        //         }else{
        //             $("#crap-debug-result").html("textStatus: " + textStatus +"\n\n There was an error connecting to " + url);
        //         }
        //         $("#float").fadeOut(300);
        //     }
        // });
    });
})


//
// function httpRequest(url, callback){
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             callback(xhr.responseText);
//         }
//     }
//     xhr.send();
// }




document.addEventListener('request', function (e) {
    var params = e.detail;
    var chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
    //chrome 73后不允许content-script 跨域
    if(chromeVersion>'73'){
        // 发送消息，backgrounds.js 会处理消息，并返回数据
        chrome.runtime.sendMessage(
            params,
            function(rs){
                document.dispatchEvent(new CustomEvent(rs.event,{detail:rs.data}));
            });
        return true;
    }

    params.complete = function (xhr, requestStatus) {
        var useTime = Date.now() - xhr.beginTime;
        document.dispatchEvent(new CustomEvent('result.complete', {
            detail: {
                requestStatus: requestStatus,
                text: (xhr.responseText || xhr.statusText),
                headers: xhr.getAllResponseHeaders(),
                readyState: xhr.readyState,
                responseText: xhr.responseText,
                status: xhr.status,
                statusText: xhr.statusText,
                useTime: useTime,
                url: request.url
            }
        }));
    };
    params.beforeSend = function (xhr) {
        xhr.beginTime = Date.now();
    };

    $.ajax(params);

    return false;
});

document.addEventListener('result.complete', function (params) {
    var statusText = params.detail.statusText;
    var status = params.detail.status;
    var responseText = params.detail.responseText;
    var url = params.detail.url;
    var requestStatus = params.detail.requestStatus;
    var useTime = params.detail.useTime;
    var headers = params.detail.headers;

    var headerInfo = "Url : " + url
        + "\nStatus : " + status
        + "\nStatusText : " + statusText
        +"\n耗时 : " + useTime + "毫秒"
        +"\n请求状态 : " + requestStatus;

    $("#crap-debug-result-div").removeClass("none");
    if(requestStatus == "success"){
        var data = responseText;
        try {
            var txtObj = JSON.parse(data);
            data = JSON.stringify(txtObj, null, 5);
            $("#crap-debug-result").val(data);
        } catch (e) {
            $("#crap-debug-result").val(data);
        }
        $("#crap-debug-headers").html(headerInfo + "\n ---------------------------------\n" + headers);
    }else{
        $("#crap-debug-headers").html(headerInfo + "\n ----------------响应头信息---------------\n" + headers);
        $("#crap-debug-result").val("-----ResponseText 返回数据-----\n\n" + responseText
            +"\n\n-------提示 ：发现异常，请检查地址、网络、返回格式是否正常-------");
    }
    $("#float").fadeOut(300);
    return true;
});
