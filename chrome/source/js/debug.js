/**
 * 准则
 * dao层的方法必须以DAO结尾
 * http请求必须以：query、update、save、get、delete开头
 * 渲染方法：draw开头
 * id、class命名用-分割
 * 常量必须大写，以_分割
 * div命名必须以id-开头，如：id-
 * 缓存数据必须以DATA_开头
 */
// 渲染模块页面
function drawModule() {
    var defaultProjectName = getLocalData(DATA_DEF_PROJECT_NAME, -1);
    var defaultProjectId = getLocalData(DATA_DEF_PROJECT_ID, -1);
    if (defaultProjectName != -1 && defaultProjectId != -1){
        setHtml(ID_DEF_PROJECT_NAME, defaultProjectName);
        queryModuleDAO(defaultProjectId, drawModuleDAO);
    } else {
        setHtml(ID_DEF_PROJECT_NAME, "请点击右侧下拉按钮选着项目");
    }
}

// 切换项目
$("body").on('click',"#id-def-project-id", function(){
    var projectId = $(this).attr(ATTR_PROJECT_ID);
    var projectName = $(this).attr(ATTR_PROJECT_NAME);
    saveLocalData(DATA_DEF_PROJECT_ID, projectId);
    saveLocalData(DATA_DEF_PROJECT_NAME, projectName);
    setHtml(ID_DEF_PROJECT_NAME, projectName);
    drawModule();
});

// 点击刷新项目按钮
$("#id-refresh-project").click(function(){
    drawModule();
});

// 点击模块，加载模块接口
$("#modules").on("click",".panel-heading", function() {
    var moduleId = $(this).attr(ATTR_MODULE_ID);
    var projectId = $(this).attr(ATTR_PROJECT_ID);

    var hasInitInterface = getAttr(ID_MODULE_INTERFACE + moduleId, ATTR_HAS_LOAD_INTERFACE);
    if (hasInitInterface && hasInitInterface == "false"){
        queryInterfaceDAO(projectId, moduleId, drawInterfaceDAO);
    }
});


// 点击接口，渲染接口数据
var inter = {};
$("#modules").on("click",".interface", function() {
    selectInterface($(this).attr(ATTR_INTERFACE_ID));
});

$("#id-interface-titles").on("click",".close-interface", function() {
    $("#" + ID_INTERFACE_DIV).addClass("none");
    $("#" + ID_WELCOME).removeClass("none");
    var id = ID_INTERFACE_TITLE + $(this).attr(ATTR_INTERFACE_ID);
    $("#" + id).remove();
});

$("#id-interface-titles").on("click",".interface-title-name", function() {
    $(".interface").removeClass("bg-main");
    $(".interface-title").removeClass("bg-main");

    selectInterface($(this).attr(ATTR_INTERFACE_ID));
});

// 批量编辑
$(".bulk-edit").click(function(){
    /**
     * 标记状态为显示状态
     */
    setAttr($(this).attr(_id), ATTR_SHOW_BULK, _true);

    var preId = $(this).attr(ATTR_HEADER_OR_PARAM);
    $("#"+preId+"-table").addClass("none");
    $("#"+preId+"-bulk-edit-div").removeClass("none");
    var bulkParams = "";
    var texts = $("#"+preId+"-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                var p = key+":" + val.value;
                if( p != ":"){
                    bulkParams += p + "\n";
                }
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) { }
    });
    $("#id-"+preId+"-bulk-value").val(bulkParams);
});

// key-value编辑
$(".key-value-edit").click(function(){
    var preId = $(this).attr(ATTR_HEADER_OR_PARAM);

    var bulkParams = "";
    if( preId == "headers"){
        setAttr(ID_HEADERS_BULK_EDIT, ATTR_SHOW_BULK, _false);
        bulkParams = getValue(ID_HEADERS_BULK_VALUE);
    }
    if( preId == "params"){
        setAttr(ID_PARAMS_BULK_EDIT, ATTR_SHOW_BULK, _false);
        bulkParams = getValue(ID_PARAMS_BULK_VALUE);
    }
    $("#"+preId+"-table").removeClass("none");
    $("#"+preId+"-bulk-edit-div").addClass("none");
    var params = bulkParams.split("\n");
    $("#"+preId+"-table tbody").empty();
    for(var i=0 ; i< params.length; i++){
        if( params[i].trim() != ""){
            var p = params[i].split(":");
            if(p.length>2){
                for(var j=2 ; j< p.length; j++){
                    p[1] = p[1] +":" + p[j];
                }
            }
            var key = p[0];
            var value = "";
            if(p.length >1 ){
                value = p[1];
            }
            var tdText = paramsTr.replace("'key'","'key' value='"+key+"'").replace("'value'","'value' value='"+value+"'");
            tdText = tdText.replace("last","");
            $("#"+preId+"-table tbody").append(tdText);
        }
    }
    $("#"+preId+"-table tbody").append(paramsTr);
});

function selectInterface(interfaceId) {

    // 切换页面
    $("#" + ID_INTERFACE_DIV).removeClass("none");
    $("#" + ID_WELCOME).addClass("none");

    var interfaceTitleDivId = ID_INTERFACE_TITLE + interfaceId;

    // 将当前页面数据存入变量，便于下次恢复

    $(".interface-title").removeClass("bg-main");
    if ($("#" + interfaceTitleDivId).length > 0){
        $("#" + interfaceTitleDivId).addClass("bg-main");

        // 将当前页面数据存储至db
        inter = getInterfaceFromHtml(inter);
        saveLocalData(DATA_INTERFACE_TEMP + $("#" + ID_INTERFACE_ID).val(), JSON.stringify(inter));

        inter = getLocalJson(DATA_INTERFACE_TEMP + interfaceId, "{}");

    } else {
        inter = adapterGetInterface(getInterfaceDAO(interfaceId));
        if (inter == null){
            return;
        }
        saveLocalData(DATA_INTERFACE_TEMP + interfaceId, JSON.stringify(inter));

        var interTitleHtmlList = $("#" + ID_INTERFACE_TITLES).html();
        $("#" + ID_INTERFACE_TITLES).html(interTitleHtmlList + (interfaceTitleDiv.replace(/ca_id/g,inter.id).replace(/ca_name/g,inter.name)));
    }


    setValue(ID_URL, inter.url);
    setValue(ID_INTERFACE_ID, inter.id)
    setValue(ID_MODULE_ID, inter.moduleId)
    setValue(ID_INTERFACE_NAME, handerStr(inter.name));
    if (inter.method.indexOf("POST") >= 0){
        setValue(ID_METHOD, 'POST');
    }else if (inter.method.indexOf("GET") >= 0){
        setValue(ID_METHOD, 'GET');
    }else{
        setValue(ID_METHOD, inter.method);
    }

    $("#" + ID_METHOD).change();
    // TODO 服务器支持paramType 存储
    // key-value键值对输入方法
    if($.inArray(inter.paramType, customerTypes) == -1){
        // 选中参数输入table
        prop(ID_PARAM_TYPE);
        setValue(ID_PARAMS_BULK_VALUE, inter.params);
        $("#params-bulk-edit-div .key-value-edit").click();
    }
    // 自定义参数输入
    else{
        prop(ID_CUSTOMER_TYPE);
        // 下拉选择 id-customer-type-select
        $("#" + ID_CUSTOMER_TYPE_SELECT).val(inter.paramType);
        $("#" + ID_CUSTOMER_TYPE_SELECT).change();
        $("#customer-value").val(inter.params);
    }
    setValue(ID_HEADERS_BULK_VALUE, inter.headers);
    $("#headers-bulk-edit-div .key-value-edit").click();
    $("input[name='param-type']").change();

    $(".interface").removeClass("bg-main");
    $("#" + ID_INTERFACE_MENU + interfaceId).addClass("bg-main");
}
