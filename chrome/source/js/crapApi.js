$(function(){
    var pageName = getValue(ID_PAGE_NAME);
    if (pageName == "debug"){
        // getAdvertisement();
        // 远程获取所有项目列表，TODO bug：只能显示前50条
        queryProjectDAO(drawProjectDAO);
        drawModule();
        getLoginInfoDAO(drawLoginInfoDAO);
    } else if (pageName == "setting"){
        $("#website-url").val(getWebSiteUrl());
        $("#http-timeout").val(getHttpTimeout());
    }

    $("#history-title").click(function(){
        $("#history").removeClass("none");
        $("#modules").addClass("none");
        $("#modules-title").removeClass("bb3");
        $(this).addClass("bb3");
        daoDrawHistory();
    });
    $("#modules-title").click(function(){
        $("#history").addClass("none");
        $("#modules").removeClass("none");
        $("#history-title").removeClass("bb3");
        $(this).addClass("bb3");
    });

    $("#history").on("click","div", function() {
        // 切换页面
        $("#" + ID_INTERFACE_DIV).removeClass("none");
        $("#" + ID_WELCOME).addClass("none");

        // title
        $(".interface-title").removeClass("bg-main");
        $(".history-div").removeClass("bg-main");
        $(this).addClass("bg-main");

        var inter = getNewInterface();

        inter = getInterfaceFromHtml(inter);
        saveLocalData(DATA_INTERFACE_TEMP + $("#" + ID_INTERFACE_ID).val(), JSON.stringify(inter));

        var interfaceTitleDivId = ID_INTERFACE_TITLE + "-1";
        if ($("#" + interfaceTitleDivId).length > 0) {
            $("#" + interfaceTitleDivId).addClass("bg-main");
        }else {
            var interTitleHtmlList = $("#" + ID_INTERFACE_TITLES).html();
            $("#" + ID_INTERFACE_TITLES).html(interTitleHtmlList + (interfaceTitleDiv.replace(/ca_id/g,"-1").replace(/ca_name/g, "历史调试记录")));
        }

        var urlInfo = $.parseJSON( $(this).attr("crap-data") );
        setValue(ID_URL, urlInfo.url);
        setValue(ID_INTERFACE_ID, "-1");
        $("#id-module-id").val("-1");
        $("#id-interface-name").val(handerStr(urlInfo.name));
        $("#id-headers-bulk-value").val(urlInfo.headers);
        $("#id-method").val(urlInfo.method);
        $("#id-method").change();

        if($.inArray(urlInfo.paramType, customerTypes) == -1){
            urlInfo.paramType = "x-www-form-urlencoded;charset=UTF-8";
            $("#id-param-type").prop("checked",true);
            $("#id-params-bulk-value").val(urlInfo.params);
            $(".key-value-edit").click();
        }else{
            $("#id-customer-type").prop("checked",true);
            // 下拉选择 customer-type
            $("#id-customer-type-select").val(urlInfo.paramType);
            $("#id-customer-type-select").change();
            $("#customer-value").val(urlInfo.params);
        }
        $("input[name='param-type']").change();
    });


    $("#left-enlarge").click(function(){
        if( !leftEnlarge){
            leftEnlarge = true;
            $("#left").css("width","18%");
            $("#right").css("width","82%");
            $("#left-enlarge div").html("<i class='iconfont'>&#xe6a7;</i>");
        }else{
            leftEnlarge = false;
            $("#left").css("width","0%");
            $("#right").css("width","100%");
            $("#left-enlarge div").html("<i class='iconfont'>&#xe697;</i>");
        }

    });
	$("#open-debug").click(function(){
			window.open("debug.html")
	});
    $("#open-json").click(function(){
        window.open("json.html")
    });

    $("#set-web-site").click(function(){
        window.open("setting.html")
    });
    $("#set-website-button").click(function(){
        setWebSiteUrl($("#website-url").val());
        saveLocalData(DATA_DEF_PROJECT_ID, '');
        saveLocalData(DATA_DEF_PROJECT_NAME, '');
    });
    $("#http-timeout-button").click(function(){
        setHttpTimeout($("#http-timeout").val());
    });
    $("#id-login").click(function(){
        window.open(getWebSiteUrl() + "/loginOrRegister.do#/login");
    });

	$(".params-headers-table").on("keyup","input", function() {
      if($(this).val() != ''){
          var tr = $(this).parent().parent();
          if( tr.hasClass("last") ){
              var table = tr.parent();
              table.append(paramsTr);
              tr.removeClass("last");
          }
      }
    });
	
	$("#format-row").click(function(){
	    var rowData = originalResponseText;
	    if( rowData == ""){
            rowData = $("#response-row").val();
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $("#response-row").val(rowData);
        responseShow("response-row");
        $('#response-row').removeAttr("readonly");
        originalResponseText = "";
    });

    $("#format-pretty").click(function(){
        var rowData = originalResponseText;
        if( rowData == ""){
            rowData = $("#response-row").val();
        }
        try{
            $("#response-row").val(jsonFormat(rowData));
        }catch(e){
            console.warn(e)
            $("#response-row").val(rowData);
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $('#response-row').attr("readonly","readonly");
        responseShow("response-row");
    });

    $('.response-json').on('click', function() {
       if( !formatJson() ){
            return;
       }
       changeBg("btn-default", "btn-main", "response-menu",this);
	   var value = $(this).attr("crap-data-value");
	   var key = $(this).attr("crap-data-name");
       $('#response-pretty').JSONView(key, value);
       responseShow("response-pretty");
    });

    $(".params-headers-table").on("click","i",function() {
        var tr = $(this).parent().parent();
        // 最后一行不允许删除
        if( tr.hasClass("last")){
            return;
        }
        tr.remove();
    });

    // 请求头、参数切换
  $(".params-title").click(function(){
        $(".params-title").removeClass("bb3");
        $(this).addClass("bb3");
        var contentDiv = $(this).attr("data-stage");
        $("#headers-div").addClass("none");
        $("#params-div").addClass("none");
        $("#"+contentDiv).removeClass("none");
  });

    $(".response-title").click(function(){
        $(".response-title").removeClass("bb3");

        $(this).addClass("bb3");
        var contentDiv = $(this).attr("data-stage");
        $(".response-header").addClass("none");
        $(".response-body").addClass("none");
        $(".response-cookie").addClass("none");
        $("."+contentDiv).removeClass("none");
    });


    $("#" + ID_METHOD).change(function() {
        if(hasConsumer()){
            if($("#" + ID_CONTENT_TYPE).hasClass("none")){
                $("#" + ID_CONTENT_TYPE).removeClass("none");
            }
        }else{
            if(!$("#" + ID_CONTENT_TYPE).hasClass("none")){
                $("#" + ID_CONTENT_TYPE).addClass("none");
            }
            $("#id-param-type").prop("checked",true);
            $("input[name='param-type']").change();
        }
    });

    // param-type=customer
    $("#id-customer-type-select").change(function() {
        $("#id-customer-type").val( $("#id-customer-type-select").val() );
    });
    // 单选param-type监控
    $("input[name='param-type']").change(function(){
        var crapData = $("input[name='param-type']:checked").attr("crap-data");
        if( crapData && crapData=="customer") {
            $("#customer-type").removeClass("none")
            $("#params-table").addClass("none");
            $("#customer-div").removeClass("none");
            $("#id-customer-type-select").removeClass("none");
        }else{
            $("#customer-type").addClass("none");
            $("#customer-div").addClass("none");
            $("#params-table").removeClass("none");
            $("#id-customer-type-select").addClass("none");
        }
    });

  // 插件调试send
  $("#send").click(function(){
	  if( getAttr(ID_HEADERS_BULK_EDIT, ATTR_SHOW_BULK) == _true){
		 $("#headers-bulk-edit-div .key-value-edit").click();
	  }
	  if( getAttr(ID_PARAMS_BULK_EDIT, ATTR_SHOW_BULK) == _true ){
		 $("#params-bulk-edit-div .key-value-edit").click();
	  }
      callAjax();
  });

  // div 拖动
    $("#left").resizable(
        {
            autoHide: true,
            handles: 'e',
            maxWidth: 800,
            minWidth: 260,
            resize: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();

                divTwo = $("#right"),
                    divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
            },
            stop: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();
                divTwo = $("#right");
                divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
                ui.element.css(
                    {
                        width: ui.element.width()/parentWidth*100+"%",
                    });
            }
        });
})
