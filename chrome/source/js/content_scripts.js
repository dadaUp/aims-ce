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
        $.ajax({
            type : method,
            url : url,
            async : true,
            data : params,
            beforeSend: function(request) {
                var texts = $("#editHeaderTable input[type='text']");
                var key = "";
                $.each(texts, function(i, val) {
                    if(val.name == "def"){
                        if( key != "") {
                            request.setRequestHeader(key, val.value);
                        }
                    }else if(val.name == 'name'){
                        key = val.value;
                    }
                });
            },
            complete: function(responseData, textStatus){
                $("#crap-debug-result-div").removeClass("none");
                if(textStatus == "error"){
                    $("#crap-debug-result").html("Status:" + responseData.status + "\nStatusText:" + responseData.statusText +"\nTextStatus: " + textStatus +"\nCould not get any response\n\nThere was an error connecting to " + url);
                }
                else if(textStatus == "success"){
                    var data = responseData.responseText;
                    try {
                        var txtObj = JSON.parse(data);
                        data = JSON.stringify(txtObj, null, 5);
                        $("#crap-debug-result").html(data);
                    } catch (e) {
                        $("#crap-debug-result").html(data);
                    }
                }else{
                    $("#crap-debug-result").html("textStatus: " + textStatus +"\n\n There was an error connecting to " + url);
                }
                $("#float").fadeOut(300);
            }
        });
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



