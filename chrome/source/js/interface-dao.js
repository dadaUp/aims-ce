// 渲染接口
function queryInterfaceDAO(projectId, moduleId, callBack) {
    httpPost(MY_INTERFACE_LIST_URL, {"moduleId" : moduleId, "projectId": projectId, "pageSize" : 100}, true, drawInterfaceDAO, moduleId);
}

function getInterfaceDAO(id) {
    return httpPost(MY_INTERFACE_DETAIL_URL, {"id" : id}, false, null, null);
}

function getInterfaceFromHtml(inter) {
    inter.url = getValue(ID_URL)
    inter.name = getValue(ID_INTERFACE_NAME);
    inter.method = getValue(ID_METHOD);
    inter.paramType = $('input:radio[name="param-type"]:checked').val()

    // 参数
    inter.params = getBulkParams();
    if(hasConsumer() && $.inArray($('input:radio[name="param-type"]:checked').val(), customerTypes) != -1){
        inter.params = $("#customer-value").val();
    }

    // 请求头
    inter.headers = getBulkHeaders();
    return inter;
}
/**
 * 根据模块ID，渲染模块下的所有接口
 * @param response
 * @param moduleId
 */
function drawInterfaceDAO(response, moduleId) {
    var interfaceText = "";
    var interfaces = response.data;
    tip(response, 3, "接口加载成功！");
    for (var j = 0; j < interfaces.length; j++) {
        var interface = interfaces[j];
        interfaceText += interfaceDiv.replace(/ca_name/g, interface.interfaceName)
            .replace(/ca_id/g, interface.id)
            .replace(/ca_moduleId/g, interface.moduleId);

        // TODO 多种请求方式
        if (interface.method.indexOf("POST") >= 0) {
            interfaceText = interfaceText.replace("ca_methodIcon", "&#xe6c4;");
            interfaceText = interfaceText.replace("ca_method", "POST");
        } else {
            interfaceText = interfaceText.replace("ca_methodIcon", "&#xe645;");
            interfaceText = interfaceText.replace("ca_method", "GET");
        }
    }
    if(interfaces.length == 0){
        interfaceText = "<div class='pl30 pr20 f14 rel'>~尚未创建接口~</div>"
    }
    setHtml(ID_MODULE_INTERFACE + moduleId, interfaceText);
    setAttr(ID_MODULE_INTERFACE + moduleId, ATTR_HAS_LOAD_INTERFACE, true);
}